"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Tesseract from "tesseract.js";
import * as faceapi from "face-api.js";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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

export default function VerifyLandowner() {
  const queryClient = useQueryClient();
  
  const [citizenshipResetKey, setCitizenshipResetKey] = useState(0);
  const [selfieResetKey, setSelfieResetKey] = useState(0); // Key to force-reset selfie upload
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

  // 1. Load Face API Models
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

  // 2. OCR Logic
  const validateCitizenship = async (file: File) => {
    const toastId = toast.loading("Analyzing Citizenship...");
    try {
      const { data: { text } } = await Tesseract.recognize(file, "eng+nep");
      const isNepali = ["नेपाल", "CITIZENSHIP", "NEPAL"].some(kw => text.toUpperCase().includes(kw));

      if (isNepali) {
        const idMatch = text.match(/(\d+[\/\-]\d+[\/\-]\d+[\/\-]\d+)|(\d{2,}\/\d{2,})/);
        if (idMatch) form.setValue("citizenshipno", idMatch[0], { shouldValidate: true });
        
        form.setValue("frontcitizenshippic", file.name, { shouldValidate: true });
        form.setValue("backcitizenshippic", "present", { shouldValidate: true });
        
        setCitizenshipFile(file);
        toast.success("ID Recognized", { id: toastId });
      } else {
        setCitizenshipFile(null);
        setCitizenshipResetKey(prev => prev + 1);
        toast.error("Invalid ID format", { id: toastId });
      }
    } catch (e) {
      setCitizenshipFile(null);
      setCitizenshipResetKey(prev => prev + 1);
      toast.error("OCR Failed", { id: toastId });
    }
  };

  // 3. Face Detection Logic (Fixed for Retries)
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
        setSelfieFile(null);
        setSelfieResetKey(prev => prev + 1); // Reset component state
        toast.error("No face detected. Please try again.", { id: toastId });
      }
    } catch (e) {
      setSelfieFile(null);
      setSelfieResetKey(prev => prev + 1);
      toast.error("Face detection failed", { id: toastId });
    }
  };

  // 4. Submit Logic
  async function onSubmit(values: z.infer<typeof VerifyOwnerSchema>) {
    if (!citizenshipFile || !selfieFile) {
      toast.error("Please upload both required images.");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading("Uploading documents...");

    try {
      const [czRes, selfieRes] = await Promise.all([
        startCitizenshipUpload([citizenshipFile]),
        startSelfieUpload([selfieFile])
      ]);

      if (!czRes || !selfieRes) throw new Error("Cloud upload failed");

      await upgradeRequest.mutateAsync({
        citizenshipNumber: values.citizenshipno,
        documentUrl: czRes[0].ufsUrl || czRes[0].url,
        selfieUrl: selfieRes[0].ufsUrl || selfieRes[0].url,
      });

      toast.success("KYC Submitted Successfully!", { id: loadingToast });
      queryClient.invalidateQueries({ queryKey: ["kycDetails"] });
    } catch (e: any) {
      const errorMsg = e.message?.includes("UNAUTHORIZED") 
        ? "Session expired. Please sign in again." 
        : (e.message || "Failed to submit");
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  }

  if (isKycLoading) return <div className="p-10 text-center"><Skeleton className="h-40 w-full" /></div>;

  if (kycDetails) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Status: <Badge variant="outline">{kycDetails.status}</Badge></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Citizenship Number</p>
            <p className="font-mono mb-4">{kycDetails.citizenshipNumber}</p>
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
        <form 
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("Validation Errors:", errors);
            toast.error("Please ensure all fields and images are provided.");
          })} 
          className="space-y-6"
        >
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="Adress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl><Input placeholder="Current Address" {...field} /></FormControl>
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

          <div className="grid grid-cols-2 gap-6 pt-4 border-t">
            <FormItem>
              <FormLabel>Citizenship (Front)</FormLabel>
              <FileUploadDemo
                key={`cz-${citizenshipResetKey}`}
                files={citizenshipFile ? [citizenshipFile] : []}
                onFilesChange={(f) => {
                  if (f.length > 0) validateCitizenship(f[0]);
                  else setCitizenshipFile(null);
                }}
                maxFiles={1}
              />
            </FormItem>
            <FormItem>
              <FormLabel>Selfie with ID</FormLabel>
              <FileUploadDemo
                key={`selfie-${selfieResetKey}`}
                files={selfieFile ? [selfieFile] : []}
                onFilesChange={(f) => {
                  if (f.length > 0) validateSelfie(f[0]);
                  else {
                    setSelfieFile(null);
                    // No key increment needed here unless you want to force clear UI
                  }
                }}
                maxFiles={1}
              />
            </FormItem>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12" 
            disabled={isProcessing || upgradeRequest.isPending}
          >
            {isProcessing ? "Processing..." : "Submit Application"}
          </Button>
        </form>
      </Form>
    </div>
  );
}