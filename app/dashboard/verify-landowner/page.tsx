"use client";

import { FileUploadDemo } from "@/components/landowner/uploadfile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VerifyOwnerSchema } from "@/lib/zodschema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// Assuming you have a centralized upload helper
import { useUploadThing } from "@/lib/useUploadthings"; 
import { toast } from "sonner";

export default function VerifyLandowner() {
  // Use the specific endpoints we defined in core.ts
  const { startUpload: startCitizenshipUpload } = useUploadThing("citizenship");
  const { startUpload: startSelfieUpload } = useUploadThing("selfie");

  const [citizenshipFile, setCitizenshipFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function onSubmit(values: z.infer<typeof VerifyOwnerSchema>) {
    if (!citizenshipFile || !selfieFile) {
      toast.error("Please upload both citizenship and selfie images.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload Citizenship Image
      const czRes = await startCitizenshipUpload([citizenshipFile]);
      if (!czRes) throw new Error("Citizenship upload failed");
      const citizenshipUrl = czRes[0].url;

      // 2. Upload Selfie Image
      const selfieRes = await startSelfieUpload([selfieFile]);
      if (!selfieRes) throw new Error("Selfie upload failed");
      const selfieUrl = selfieRes[0].url;

      // 3. Combine data for your final backend call
      const completeValues = {
        ...values,
        citizenshipUrl,
        selfieUrl,
      };

      console.log("Final Data:", completeValues);
      toast.success("Verification submitted successfully!");
      
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Something went wrong during upload.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* ... Other Fields (Full Name, Address, Citizenship No) remain the same ... */}
        
        <FormField
          control={form.control}
          name="FullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input placeholder="Enter your name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ... (Address and Citizenship No fields here) ... */}

        <div>
          <FormLabel>Citizenship Photo</FormLabel>
          <FileUploadDemo
            files={citizenshipFile ? [citizenshipFile] : []}
            onFilesChange={(files) => setCitizenshipFile(files[0] || null)}
            maxFiles={1}
          />
        </div>

        <div>
          <FormLabel>Selfie Photo</FormLabel>
          <FileUploadDemo
            files={selfieFile ? [selfieFile] : []}
            onFilesChange={(files) => setSelfieFile(files[0] || null)}
            maxFiles={1}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Submit Verification"}
        </Button>
      </form>
    </Form>
  );
}