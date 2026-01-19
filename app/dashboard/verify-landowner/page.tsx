"use client";

import { FileUploadDemo } from "@/components/landowner/uploadfile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useCitizenshipfrontpic, useCitizenshipbackpic } from '@/lib/useUploadthings'
import { toast } from "sonner";
export default function VerifyLandowner() {
    const { startUpload:startUploadczfront, isUploading:isUploadingczfront } = useCitizenshipfrontpic("photoUploader");
    const { startUpload:startUploadczback, isUploading:isUploadingczback } = useCitizenshipbackpic("photoUploader");
  const [citizenshippicfront, setcitizenshippicfront] = useState<File | null>(
    null,
  );
  const [citizenshippicback, setcitizenshippicback] = useState<File | null>(
    null,
  );
  // 1. Define your form.
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

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof VerifyOwnerSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    console.log("The picture is", citizenshippicfront);
     try {
      // Upload hero image first
      let citizenshipfronturl: string = '';
      
      if (citizenshippicfront) {
        const Res1 = await startUploadczfront([citizenshippicfront]);
        
        if (!Res1) {
          console.log("Error uploading hero image", Res1);
          return;
        }
        
        citizenshipfronturl = Res1[0].url;
        console.log('🖼️ Hero Image URL (landpic):', citizenshipfronturl);
      }

      let citizenshipbackurl: string = '';
      
      if (citizenshippicback ) {
        const Res2 = await startUploadczback([citizenshippicback]);
        
        if (!Res2) {
          console.log("Error uploading back image", Res2);
          return;
        }
        
        citizenshipbackurl = Res2[0].url;
        console.log('🖼️ Back Image URL:', citizenshipbackurl);
      }

      const completeValues = {
        ...values,
        citizenshipfronturl: citizenshipfronturl,
        citizenshipbackurl: citizenshipbackurl,
      };

      console.log(completeValues);
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="FullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Adress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your address" {...field} />
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
              <FormControl>
                <Input placeholder="Citizenship Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormLabel>Citizenship Front Photo</FormLabel>
        <FileUploadDemo
          files={citizenshippicfront ? [citizenshippicfront] : []}
          onFilesChange={(files) => setcitizenshippicfront(files[0] || null)}
          maxFiles={1}
        />
        <FormLabel>Citizenship Back Photo</FormLabel>
        <FileUploadDemo
          files={citizenshippicback ? [citizenshippicback] : []}
          onFilesChange={(files) => setcitizenshippicback(files[0] || null)}
          maxFiles={1}
        />

        <Button type="submit" >Submit</Button>
      </form>
    </Form>
  );
     }
        