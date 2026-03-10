"use client";

import { useEffect, useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Tesseract from "tesseract.js";
import * as faceapi from "face-api.js";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

// UI Components
import { FileUploadDemo } from "@/components/landowner/uploadfile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

// Hooks & Schema
import { useUploadThing } from "@/lib/useUploadthings";
import { VerifyOwnerSchema } from "@/lib/zodschema/schema";
import { useGetKycDetails, useUpgradeRequest } from "@/queryandmutation/index";

const libraries: "places"[] = ["places"];

export default function VerifyLandowner() {
  const queryClient = useQueryClient();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const [citizenshipResetKey, setCitizenshipResetKey] = useState(0);
  const [selfieResetKey, setSelfieResetKey] = useState(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [citizenshipFile, setCitizenshipFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: kycDetails, isLoading: isKycLoading } = useGetKycDetails();
  const upgradeRequest = useUpgradeRequest();
  const { startUpload: startCitizenshipUpload } = useUploadThing("citizenship");
  const { startUpload: startSelfieUpload } = useUploadThing("selfie");

  const form = useForm<z.infer<typeof VerifyOwnerSchema>>({
    resolver: zodResolver(VerifyOwnerSchema),
    mode: "onChange",
    defaultValues: {
      FullName: "",
      Adress: "",
      citizenshipno: "",
      frontcitizenshippic: "",
      backcitizenshippic: "",
    },
  });

  // Load Face API Models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        setModelsLoaded(true);
      } catch (error) {
        console.error("AI Model load error:", error);
      }
    };
    loadModels();
  }, []);

  // OCR Logic
  const validateCitizenship = async (file: File) => {
    const toastId = toast.loading("Analyzing Citizenship...");
    try {
      const { data: { text } } = await Tesseract.recognize(file, "eng+nep");
      const isNepali = ["नेपाल", "CITIZENSHIP", "NEPAL"].some(kw => text.toUpperCase().includes(kw));

      if (isNepali) {
        const idMatch = text.match(/\d{2}-\d{2}-\d{2}-\d{4,5}/) || text.match(/(\d+[\/\-]\d+[\/\-]\d+[\/\-]\d+)/);
        if (idMatch) {
          const cleanId = idMatch[0].replace(/\//g, "-");
          form.setValue("citizenshipno", cleanId, { shouldValidate: true });
        }
        form.setValue("frontcitizenshippic", file.name, { shouldValidate: true });
        form.setValue("backcitizenshippic", "present", { shouldValidate: true });
        setCitizenshipFile(file);
        toast.success("ID Recognized", { id: toastId });
      } else {
        throw new Error("Invalid ID format");
      }
    } catch (e) {
      setCitizenshipFile(null);
      setCitizenshipResetKey(prev => prev + 1);
      toast.error("OCR Failed or Invalid ID", { id: toastId });
    }
  };

  // Face Detection Logic
  const validateSelfie = async (file: File) => {
    if (!modelsLoaded) return toast.error("AI is loading...");
    const toastId = toast.loading("Checking face...");
    try {
      const img = await faceapi.bufferToImage(file);
      const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions());
      if (detection) {
        setSelfieFile(file);
        toast.success("Face verified", { id: toastId });
      } else {
        throw new Error("No face detected");
      }
    } catch (e) {
      setSelfieFile(null);
      setSelfieResetKey(prev => prev + 1);
      toast.error("Face detection failed", { id: toastId });
    }
  };

  // Autocomplete Specific Handler
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      // 1. Get Place Name (e.g., "Kalanki" or "Tribhuvan University")
      const placeName = place.name || "";

      // 2. Extract District (administrative_area_level_2 in Nepal)
      let district = "";
      if (place.address_components) {
        const districtComp = place.address_components.find(c => 
          c.types.includes("administrative_area_level_2")
        );
        district = districtComp?.long_name.replace(" District", "") || "";
      }

      // 3. Format: "Place, District"
      const formatted = district ? `${placeName}, ${district}` : placeName;
      
      if (formatted) {
        form.setValue("Adress", formatted, { shouldValidate: true });
      }
    }
  };

  async function onSubmit(values: z.infer<typeof VerifyOwnerSchema>) {
    if (!citizenshipFile || !selfieFile) return toast.error("Upload all images.");
    setIsProcessing(true);
    const loadingToast = toast.loading("Uploading...");
    try {
      const [czRes, selfieRes] = await Promise.all([
        startCitizenshipUpload([citizenshipFile]),
        startSelfieUpload([selfieFile])
      ]);
      if (!czRes || !selfieRes) throw new Error("Upload failed");
      await upgradeRequest.mutateAsync({
        citizenshipNumber: values.citizenshipno,
        documentUrl: czRes[0].ufsUrl || czRes[0].url,
        selfieUrl: selfieRes[0].ufsUrl || selfieRes[0].url,
      });
      toast.success("Submitted!", { id: loadingToast });
      queryClient.invalidateQueries({ queryKey: ["kycDetails"] });
    } catch (e: any) {
      toast.error(e.message || "Failed", { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  }

  if (isKycLoading) return <div className="p-10 text-center"><Skeleton className="h-40 w-full" /></div>;

  if (kycDetails) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10">
        <Card>
          <CardHeader><CardTitle>Status: <Badge>{kycDetails.status}</Badge></CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><p className="text-sm text-gray-500">Address</p><p className="font-medium">{kycDetails.Adress || "N/A"}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <img src={kycDetails.documentUrl} alt="ID" className="rounded border aspect-video object-cover" />
              <img src={kycDetails.selfieUrl} alt="Selfie" className="rounded border aspect-video object-cover" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl border mt-10 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Identity Verification</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="FullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input placeholder="Name as per citizenship" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="Adress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (Place, District)</FormLabel>
                  <FormControl>
                    {isLoaded ? (
                      <Autocomplete
                        onLoad={(ac) => { autocompleteRef.current = ac }}
                        onPlaceChanged={onPlaceChanged}
                        options={{
                          componentRestrictions: { country: "np" },
                          types: ["geocode", "establishment"], // Essential for Nepal landmarks
                        }}
                      >
                        <Input 
                          placeholder="Search landmark or city..." 
                          {...field} 
                          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                        />
                      </Autocomplete>
                    ) : <Skeleton className="h-10 w-full" />}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="citizenshipno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Citizenship No.</FormLabel>
                  <FormControl><Input placeholder="00-00-00-00000" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <FormItem>
              <FormLabel>Citizenship (Front)</FormLabel>
              <FileUploadDemo
                key={`cz-${citizenshipResetKey}`}
                files={citizenshipFile ? [citizenshipFile] : []}
                onFilesChange={(f) => { if (f.length > 0) validateCitizenship(f[0]); else setCitizenshipFile(null); }}
                maxFiles={1}
              />
            </FormItem>
            <FormItem>
              <FormLabel>Selfie with ID</FormLabel>
              <FileUploadDemo
                key={`selfie-${selfieResetKey}`}
                files={selfieFile ? [selfieFile] : []}
                onFilesChange={(f) => { if (f.length > 0) validateSelfie(f[0]); else setSelfieFile(null); }}
                maxFiles={1}
              />
            </FormItem>
          </div>

          <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 font-bold" disabled={isProcessing}>
            {isProcessing ? "Analyzing..." : "Submit Application"}
          </Button>
        </form>
      </Form>
    </div>
  );
}