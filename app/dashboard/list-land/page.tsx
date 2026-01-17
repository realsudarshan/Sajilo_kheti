'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import { landlistSchema } from '@/lib/zodschema/schema'
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
import { UploadButton } from '@/components/landowner/dropzone'
import { FileUpload } from '@/components/ui/file-upload'
import { FileUploadDemo } from '@/components/landowner/uploadfile'
import { useUploadLandHero, useUploadLandMany } from '@/lib/useUploadthings'

export default function Listland() {
    const { startUpload, isUploading } = useUploadLandMany("imageUploader");
    const { startUpload: startUploadHero, isUploading: isUploadingHero } = useUploadLandHero("photoUploader");
  const [files, setFiles] = useState<File[]>([])
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const form = useForm<z.infer<typeof landlistSchema>>({
    resolver: zodResolver(landlistSchema),
    defaultValues: {
      location: '',
      size: 0,
      landpic: '',
      morelandpic: [],
      price: 0,
      description: '',
    },
  })

  async function onSubmit(values: z.infer<typeof landlistSchema>) {
    console.log('✅ onSubmit called!')
    alert('Form submitted! Check console for details.')

    try {
      // Upload hero image first
      let heroImageUrl: string = '';
      
      if (heroFile) {
        const heroRes = await startUploadHero([heroFile]);
        
        if (!heroRes) {
          console.log("Error uploading hero image", heroRes);
          return;
        }
        
        heroImageUrl = heroRes[0].url;
        console.log('🖼️ Hero Image URL (landpic):', heroImageUrl);
      }

      // Upload multiple land images
      let uploadedUrls: string[] = [];
      
      if (files && files.length > 0) {
        const res = await startUpload(files);
        
        if (!res) {
          alert("Error uploading land images");
          return;
        }
        
        uploadedUrls = res.map((file) => file.url);
        console.log('📸 Land Images URLs (morelandpic):', uploadedUrls);
      }

      // Construct the final data object for your database
      const completeValues = {
        ...values,
        landpic: heroImageUrl,
        morelandpic: uploadedUrls,
      };

      console.log('✅ Final data for Database:', completeValues);

      // Send to your Database (Server Action or API)
      // await myServerAction(completeValues);

      alert('Form and all images submitted successfully!');
      
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("Something went wrong during submission.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* List Your Land Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">List Your Land</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Location Field */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Size Field */}
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size (sq ft)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter land size"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price Field */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter price"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FileUploadDemo files={files} onFilesChange={setFiles} maxFiles={5} />   

              {/* Hero Land Upload Section */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Upload Hero Image</h3>
                <FileUploadDemo 
                  files={heroFile ? [heroFile] : []} 
                  onFilesChange={(files) => setHeroFile(files[0] || null)}
                  maxFiles={1}
                />
              </div>

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter land description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
