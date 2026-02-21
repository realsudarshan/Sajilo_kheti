"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Tesseract from "tesseract.js";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

// Schema and Hooks
import { useUploadThing } from "@/lib/useUploadthings";
import { VerifyOwnerSchema } from "@/lib/zodschema/schema";
import { useGetKycDetails, useUpgradeRequest } from "@/queryandmutation/index";

export default function VerifyLandowner() {
  const [resetKey, setResetKey] = useState(0);
  const { data: kycDetails, isLoading: isKycLoading } = useGetKycDetails();
  const upgradeRequest = useUpgradeRequest();

  const { startUpload: startCitizenshipUpload } = useUploadThing("citizenship");
  const { startUpload: startSelfieUpload } = useUploadThing("selfie");

  const [citizenshipFile, setCitizenshipFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof VerifyOwnerSchema>>({
    resolver: zodResolver(VerifyOwnerSchema),
    defaultValues: {
      FullName: "",
      Adress: "",
      frontcitizenshippic: "",
      backcitizenshippic: "",
      citizenshipno: "",
    },
  });

  //citizenship validation function
  // citizenship validation function
  const validateNepaliID = async (file: File) => {
    const toastId = toast.loading("Scanning Citizenship Card...");
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng+nep");

      const nepaliKeywords = [
        "नेपाल",
        "नेपाली",
        "नागरिकता",
        "नागरिकताको",
        "प्रमाणपत्र",
        "CITIZENSHIP",
        "NEPAL",
      ];
// Convert text to uppercase for case-insensitive matching
      const upperText = text.toUpperCase();
      const isMatch = nepaliKeywords.some((word) =>
        upperText.includes(word.toUpperCase()),
      );

      if (isMatch) {
        toast.success("Nepali Citizenship detected!", { id: toastId });
        setCitizenshipFile(file);
      } else {
        toast.error(
          "Invalid Document. Please upload a clear photo of your Citizenship.",
          { id: toastId },
        );
        setCitizenshipFile(null);
        // Bumping this number forces the FileUploadDemo to destroy and recreate itself
        setResetKey((prev) => prev + 1);
      }
    } catch (error) {
      toast.error("Error reading image. Please try again.", { id: toastId });
      setCitizenshipFile(null);
      setResetKey((prev) => prev + 1);
    }
  };

  async function onSubmit(values: z.infer<typeof VerifyOwnerSchema>) {
    if (!citizenshipFile || !selfieFile) {
      toast.error("Please provide both the citizenship photo and the selfie.");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading("Uploading documents and saving...");

    try {
      const [czRes, selfieRes] = await Promise.all([
        startCitizenshipUpload([citizenshipFile]),
        startSelfieUpload([selfieFile]),
      ]);

      if (!czRes || !selfieRes) {
        throw new Error("File upload failed. Please try again.");
      }

      await upgradeRequest.mutateAsync({
        citizenshipNumber: values.citizenshipno,
        documentUrl: czRes[0].url,
        selfieUrl: selfieRes[0].url,
      });

      toast.success("KYC Verification request submitted!", {
        id: loadingToast,
      });

      form.reset();
      setCitizenshipFile(null);
      setSelfieFile(null);
      // Ideally trigger a refetch here or invalidate query
      window.location.reload();
    } catch (error: any) {
      console.error("Submission Error:", error);
      toast.error(error.message || "Something went wrong", {
        id: loadingToast,
      });
    } finally {
      setIsProcessing(false);
    }
  }

  if (isKycLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Skeleton className="h-12 w-48 mb-6" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  if (kycDetails) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              KYC Application Status
              <Badge
                variant={
                  kycDetails.status === "APPROVED"
                    ? "default"
                    : kycDetails.status === "REJECTED"
                      ? "destructive"
                      : "secondary"
                }
              >
                {kycDetails.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Citizenship Number
                </p>
                <p>{kycDetails.citizenshipNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Submitted At
                </p>
                {/* Assuming created_at or updated_at isn't in returned object currently, skipping date */}
                <p>Recent</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border rounded-lg p-2">
                <p className="text-sm font-medium mb-2">Document</p>
                <img
                  src={kycDetails.documentUrl}
                  alt="Citizenship"
                  className="w-full h-48 object-cover rounded"
                />
              </div>
              {kycDetails.selfieUrl && (
                <div className="border rounded-lg p-2">
                  <p className="text-sm font-medium mb-2">Selfie</p>
                  <img
                    src={kycDetails.selfieUrl}
                    alt="Selfie"
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              )}
            </div>

            {kycDetails.status === "REJECTED" && (
              <div className="bg-red-50 p-4 rounded-md text-red-800 mt-4">
                <p className="font-semibold">Your application was rejected.</p>
                <p className="text-sm">
                  Please contact support or re-apply if allowed.
                </p>
              </div>
            )}

            {kycDetails.status === "PENDING" && (
              <div className="bg-blue-50 p-4 rounded-md text-blue-800 mt-4">
                <p>
                  Your application is currently under review. This process
                  normally takes 24-48 hours.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">Verify Identity</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="FullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Country" {...field} />
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
                  <FormLabel>Citizenship Number</FormLabel>
                  <FormControl>
                    <Input placeholder="ID Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <hr className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem>
              <FormLabel className="font-semibold">
                Citizenship (Front)
              </FormLabel>
              <FileUploadDemo
                // By using resetKey here, the component completely resets
                // when setResetKey is called in the validator.
                key={`citizenship-${resetKey}`}
                files={citizenshipFile ? [citizenshipFile] : []}
                onFilesChange={(files) => {
                  if (files.length > 0) {
                    validateNepaliID(files[0]);
                  } else {
                    setCitizenshipFile(null);
                  }
                }}
                maxFiles={1}
              />
            </FormItem>

            <FormItem>
              <FormLabel className="font-semibold">Selfie with ID</FormLabel>
              <FileUploadDemo
                files={selfieFile ? [selfieFile] : []}
                onFilesChange={(files) => setSelfieFile(files[0] || null)}
                maxFiles={1}
              />
            </FormItem>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg"
            disabled={isProcessing || upgradeRequest.isPending}
          >
            {isProcessing ? "Processing..." : "Submit for Verification"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
