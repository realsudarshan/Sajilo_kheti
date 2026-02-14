'use client'

import { useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { FileUploadDemo } from '@/components/landowner/uploadfile'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useUploadThing } from '@/lib/useUploadthings'
import { LandSizeSchema } from '@/lib/zodschema/schema'
import { usePublishLand } from '@/queryandmutation'

// Define schema inline
const formSchema = z.object({
  title: z.string().min(5, "Title is too short").max(100),
  location: z.string().min(1, "Location is required"),
  size: LandSizeSchema,
  price: z.number().positive("Price must be greater than 0"),
  description: z.string().min(10, "Please provide a more detailed description"),
})

type FormData = z.infer<typeof formSchema>

export default function Listland() {
  const { user } = useUser()
  const router = useRouter()
  const { startUpload, isUploading } = useUploadThing("imageUploader")
  const { startUpload: startUploadHero, isUploading: isUploadingHero } = useUploadThing("photoUploader")
  const publishLand = usePublishLand()

  const [files, setFiles] = useState<File[]>([])
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [lalpurjaFile, setLalpurjaFile] = useState<File | null>(null)
  const [measurementSystem, setMeasurementSystem] = useState<'HILLY' | 'TERAI' | 'FLAT'>('HILLY')

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      location: '',
      size: {
        system: 'HILLY',
        ropani: 0,
        aana: 0,
        paisa: 0,
        daam: 0,
      },
      price: 0,
      description: '',
    },
  })

  const handleSystemChange = (newSystem: 'HILLY' | 'TERAI' | 'FLAT') => {
    setMeasurementSystem(newSystem)

    if (newSystem === 'HILLY') {
      form.setValue('size', {
        system: 'HILLY',
        ropani: 0,
        aana: 0,
        paisa: 0,
        daam: 0,
      })
    } else if (newSystem === 'TERAI') {
      form.setValue('size', {
        system: 'TERAI',
        bigha: 0,
        kattha: 0,
        dhur: 0,
      })
    } else {
      form.setValue('size', {
        system: 'FLAT',
        value: 0,
        unit: 'SQ_FT',
      })
    }
  }

  const onSubmit = async (values: FormData) => {
    if (!user?.id) {
      toast.error('You must be logged in to list land')
      return
    }

    if (!heroFile) {
      toast.error('Please upload a hero image')
      return
    }

    try {
      const heroRes = await startUploadHero([heroFile])
      if (!heroRes) {
        toast.error('Failed to upload hero image')
        return
      }
      const heroImageUrl = heroRes[0].url

      let galleryUrls: string[] = []
      if (files && files.length > 0) {
        const res = await startUpload(files)
        if (!res) {
          toast.error('Failed to upload gallery images')
          return
        }
        galleryUrls = res.map((file: any) => file.url)
      }

      let lalpurjaUrl: string | null = null
      if (lalpurjaFile) {
        const lalpurjaRes = await startUploadHero([lalpurjaFile])
        if (lalpurjaRes) {
          lalpurjaUrl = lalpurjaRes[0].url
        }
      }

      await publishLand.mutateAsync({
        ownerId: user.id,
        title: values.title,
        location: values.location,
        size: values.size,
        price: values.price,
        description: values.description,
        landpic: heroImageUrl,
        morelandpic: galleryUrls,
        lalpurjaUrl: lalpurjaUrl||undefined,
      })

      toast.success('Land listed successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Upload failed:', error)
      toast.error(error.message || 'Failed to list land')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">List Your Land</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Prime Agricultural Land in Kathmandu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Kathmandu, Nepal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Measurement System</FormLabel>
                <Select
                  value={measurementSystem}
                  onValueChange={handleSystemChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select measurement system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HILLY">Hilly Region (Ropani/Aana/Paisa/Daam)</SelectItem>
                    <SelectItem value="TERAI">Terai Region (Bigha/Kattha/Dhur)</SelectItem>
                    <SelectItem value="FLAT">Simple Units (Sq Ft/Sq Mtr)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {measurementSystem === 'HILLY' && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="size.ropani"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ropani</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="size.aana"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aana (0-15.99)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="size.paisa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paisa (0-3.99)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="size.daam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daam (0-3.99)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {measurementSystem === 'TERAI' && (
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="size.bigha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bigha</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="size.kattha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kattha (0-19.99)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="size.dhur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dhur (0-19.99)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {measurementSystem === 'FLAT' && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="size.value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="size.unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SQ_FT">Square Feet</SelectItem>
                            <SelectItem value="SQ_MTR">Square Meter</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Month (NPR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your land, its features, and suitability for farming"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Hero Image <span className="text-red-500">*</span>
                </h3>
                <FileUploadDemo
                  files={heroFile ? [heroFile] : []}
                  onFilesChange={(files) => setHeroFile(files[0] || null)}
                  maxFiles={1}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Gallery Images</h3>
                <FileUploadDemo
                  files={files}
                  onFilesChange={setFiles}
                  maxFiles={5}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Lalpurja Document</h3>
                <FileUploadDemo
                  files={lalpurjaFile ? [lalpurjaFile] : []}
                  onFilesChange={(files) => setLalpurjaFile(files[0] || null)}
                  maxFiles={1}
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isUploading || isUploadingHero || publishLand.isPending}
                >
                  {publishLand.isPending ? 'Publishing...' : 'Publish Land'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}