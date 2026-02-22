'use client'

import { useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api'

// UI Components
import { FileUploadDemo } from '@/components/landowner/uploadfile'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUploadThing } from '@/lib/useUploadthings'
import { LandSizeSchema } from '@/lib/zodschema/schema'
import { usePublishLand } from '@/queryandmutation'

const LIBRARIES: ("places")[] = ["places"];

const TERAI_DISTRICTS = [
  "Jhapa", "Morang", "Sunsari", "Saptari", "Siraha", "Dhanusha", "Mahottari", 
  "Sarlahi", "Rautahat", "Bara", "Parsa", "Chitwan", "Nawalpur", "Parasi", 
  "Rupandehi", "Kapilvastu", "Dang", "Banke", "Bardiya", "Kailali", "Kanchanpur"
];

const INITIAL_COORDS = { lat: 27.7172, lng: 85.3240 };

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  location: z.string().min(1, "Location is required"),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
  size: LandSizeSchema,
  price: z.number().positive("Price must be a positive number"),
  description: z.string().min(20, "Please provide a detailed description"),
})

export default function ListLandPage() {
  const { user } = useUser()
  const router = useRouter()
  const publishLand = usePublishLand()
  
  const { startUpload, isUploading } = useUploadThing("imageUploader")
  const { startUpload: startUploadHero, isUploading: isUploadingHero } = useUploadThing("photoUploader")

  const [files, setFiles] = useState<File[]>([])
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [lalpurjaFile, setLalpurjaFile] = useState<File | null>(null)
  const [measurementSystem, setMeasurementSystem] = useState<'HILLY' | 'TERAI'>('HILLY')

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: LIBRARIES,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      location: '',
      coordinates: INITIAL_COORDS,
      size: { system: 'HILLY', ropani: 0, aana: 0, paisa: 0, daam: 0 },
      price: 0,
      description: '',
    },
  })

  const handleRegionSwitch = useCallback((district: string | undefined) => {
    if (!district) return;
    const isTerai = TERAI_DISTRICTS.includes(district);
    const targetSystem = isTerai ? 'TERAI' : 'HILLY';

    if (measurementSystem !== targetSystem) {
      setMeasurementSystem(targetSystem);
      form.setValue('size', isTerai 
        ? { system: 'TERAI', bigha: 0, kattha: 0, dhur: 0 } 
        : { system: 'HILLY', ropani: 0, aana: 0, paisa: 0, daam: 0 }
      );
      toast.info(`Switched to ${targetSystem} measurement system`);
    }
  }, [measurementSystem, form]);

  const updateLocationData = useCallback((lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results) {
        const isNepal = results.some(r => r.address_components.some(c => c.short_name === 'NP'));
        if (!isNepal) {
          toast.error("Location must be within Nepal.");
          form.setValue("coordinates", INITIAL_COORDS);
          return;
        }

        const bestMatch = results.find(r => !r.types.includes("plus_code") && !r.formatted_address.includes("+")) || results[0];
        const district = bestMatch.address_components.find(c => c.types.includes("administrative_area_level_2"))?.long_name;
        handleRegionSwitch(district);
        form.setValue("location", bestMatch.formatted_address.split(", Nepal")[0]);
      }
    });
  }, [handleRegionSwitch, form]);

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const coords = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
      const district = place.address_components?.find(c => c.types.includes("administrative_area_level_2"))?.long_name;
      form.setValue("coordinates", coords);
      form.setValue("location", place.formatted_address?.split(", Nepal")[0] || "");
      handleRegionSwitch(district);
      mapRef.current?.panTo(coords);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) return toast.error('Please login first');
    if (!heroFile) return toast.error('Please upload a display image');
    if (!lalpurjaFile) return toast.error('Please upload Lalpurja');

    try {
      const heroRes = await startUploadHero([heroFile])
      if (!heroRes) throw new Error('Display image upload failed')
      
      let galleryUrls = files.length > 0 ? (await startUpload(files))?.map(f => f.url) : [];
      let lalpurjaUrl = (await startUploadHero([lalpurjaFile]))?.[0].url;

      await publishLand.mutateAsync({
        ownerId: user.id,
        ...values,
        landpic: heroRes[0].url,
        morelandpic: galleryUrls || [],
        lalpurjaUrl: lalpurjaUrl,
      })

      toast.success('Land published successfully!');
      router.push('/dashboard');
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
    }
  }

  if (!isLoaded) return <div className="p-20 text-center">Initialising Maps...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight">List Your Property</h1>
        <p className="text-muted-foreground">Provide accurate details to sell your land faster.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* SECTION 1: TITLE */}
          <div className="p-6 bg-white border rounded-xl shadow-sm space-y-6">
            <h2 className="text-xl font-bold border-b pb-2">1. Basic Information</h2>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Prime land for sale in Pokhara" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* SECTION 2: LOCATION */}
          <div className="p-6 bg-white border rounded-xl shadow-sm space-y-6">
            <h2 className="text-xl font-bold border-b pb-2">2. Location Details</h2>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search Address</FormLabel>
                  <Autocomplete 
                    onLoad={(a) => { autocompleteRef.current = a }} 
                    onPlaceChanged={onPlaceChanged} 
                    options={{ componentRestrictions: { country: "np" } }}
                  >
                    <Input placeholder="Search location..." {...field} className="h-12 border-blue-100" />
                  </Autocomplete>
                  <FormDescription>Detected: <b>{measurementSystem} System</b></FormDescription>
                </FormItem>
              )}
            />
            <div className="h-[400px] w-full rounded-lg overflow-hidden border">
              <GoogleMap 
                onLoad={(m) => { mapRef.current = m }} 
                mapContainerStyle={{ width: '100%', height: '100%' }} 
                center={form.watch("coordinates")} 
                zoom={15}
              >
                <Marker 
                  position={form.watch("coordinates")} 
                  draggable={true} 
                  onDragEnd={(e) => {
                    const lat = e.latLng?.lat(); const lng = e.latLng?.lng();
                    if (lat && lng) {
                      form.setValue("coordinates", { lat, lng });
                      if (debounceTimer.current) clearTimeout(debounceTimer.current);
                      debounceTimer.current = setTimeout(() => updateLocationData(lat, lng), 500);
                    }
                  }} 
                />
              </GoogleMap>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* SECTION 3: SIZE */}
            <div className="p-6 bg-white border rounded-xl shadow-sm space-y-6">
              <h2 className="text-xl font-bold border-b pb-2">3. Land Area</h2>
              <div className="grid grid-cols-2 gap-4">
                {measurementSystem === 'HILLY' ? (
                  ['ropani', 'aana', 'paisa', 'daam'].map((unit) => (
                    <FormField key={unit} control={form.control} name={`size.${unit}` as any} render={({ field }) => (
                      <FormItem><FormLabel className="capitalize">{unit}</FormLabel><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormItem>
                    )} />
                  ))
                ) : (
                  ['bigha', 'kattha', 'dhur'].map((unit) => (
                    <FormField key={unit} control={form.control} name={`size.${unit}` as any} render={({ field }) => (
                      <FormItem><FormLabel className="capitalize">{unit}</FormLabel><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormItem>
                    )} />
                  ))
                )}
              </div>
            </div>

            {/* SECTION 4: SIMPLE PRICING */}
            <div className="p-6 bg-white border rounded-xl shadow-sm space-y-6">
              <h2 className="text-xl font-bold border-b pb-2">4. Pricing</h2>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Price (NPR)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 5000000" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))} 
                      />
                    </FormControl>
                    <FormDescription>Enter the total valuation for the entire plot.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* SECTION 5: MEDIA */}
          <div className="p-6 bg-white border rounded-xl shadow-sm space-y-8">
            <h2 className="text-xl font-bold border-b pb-2">5. Photos & Lalpurja</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <FormLabel>Main Photo *</FormLabel>
                <FileUploadDemo files={heroFile ? [heroFile] : []} onFilesChange={f => setHeroFile(f[0] || null)} maxFiles={1} />
              </div>
              <div className="space-y-2">
                <FormLabel>Other Photos (Max 5)</FormLabel>
                <FileUploadDemo files={files} onFilesChange={setFiles} maxFiles={5} />
              </div>
              <div className="space-y-2">
                <FormLabel>Lalpurja *</FormLabel>
                <FileUploadDemo files={lalpurjaFile ? [lalpurjaFile] : []} onFilesChange={f => setLalpurjaFile(f[0] || null)} maxFiles={1} />
              </div>
            </div>
          </div>

          {/* SECTION 6: DESCRIPTION */}
          <div className="p-6 bg-white border rounded-xl shadow-sm space-y-6">
            <h2 className="text-xl font-bold border-b pb-2">6. Description</h2>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl><Textarea className="min-h-[150px]" placeholder="Road access, water, electricity, nearby landmarks..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-xl font-bold shadow-xl"
            disabled={isUploading || isUploadingHero || publishLand.isPending}
          >
            {publishLand.isPending ? "Publishing..." : "🚀 Post Land Listing"}
          </Button>

        </form>
      </Form>
    </div>
  )
}