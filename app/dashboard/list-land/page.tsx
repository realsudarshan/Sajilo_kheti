'use client'

import { useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

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
import { landlistSchema } from '@/lib/zodschema/schema'
import { usePublishLand } from '@/queryandmutation'
import { toast } from 'sonner'

type LandFormData = z.infer<typeof landlistSchema>

export default function Listland() {
  const { user } = useUser()
  const router = useRouter()
  const { startUpload, isUploading } = useUploadThing("imageUploader")
  const { startUpload: startUploadHero, isUploading: isUploadingHero } = useUploadThing("photoUploader")
  const publishLand = usePublishLand()

  const [files, setFiles] = useState<File[]>([])
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [lalpurjaFile, setLalpurjaFile] = useState<File | null>(null)

  const form = useForm<LandFormData>({
    resolver: zodResolver(landlistSchema),
    defaultValues: {
      title: '',
      location: '',
      size: {
        size: 1,
        unit: 'ROPANI' as const,
      },
      price: 0,
      description: '',
      landpic: '',
      morelandpic: [],
      lalpurjaUrl: '',
    },
  })

  async function onSubmit(values: LandFormData) {
    if (!user?.id) {
      toast.error('You must be logged in to list land')
      return
    }

    if (!heroFile) {
      toast.error('Please upload a hero image')
      return
    }

    try {
      // Upload hero image
      const heroRes = await startUploadHero([heroFile])
      if (!heroRes) {
        toast.error('Failed to upload hero image')
        return
      }
      const heroImageUrl = heroRes[0].url

      // Upload gallery images
      let galleryUrls: string[] = []
      if (files && files.length > 0) {
        const res = await startUpload(files)
        if (!res) {
          toast.error('Failed to upload gallery images')
          return
        }
        galleryUrls = res.map((file: any) => file.url)
      }

      // Upload lalpurja document
      let lalpurjaUrl: string | undefined
      if (lalpurjaFile) {
        const lalpurjaRes = await startUploadHero([lalpurjaFile])
        if (lalpurjaRes) {
          lalpurjaUrl = lalpurjaRes[0].url
        }
      }

      // Publish land
      await publishLand.mutateAsync({
        ownerId: user.id,
        title: values.title,
        location: values.location,
        size: values.size,
        price: values.price,
        description: values.description,
        landpic: heroImageUrl,
        morelandpic: galleryUrls,
        lalpurjaUrl: lalpurjaUrl,
      })

      toast.success('Land listed successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('❌ Upload failed:', error)
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
              {/* Title Field */}
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

              {/* Location Field */}
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

              {/* Size Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="size.size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter size"
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ROPANI">Ropani</SelectItem>
                          <SelectItem value="AANA">Aana</SelectItem>
                          <SelectItem value="PAISA">Paisa</SelectItem>
                          <SelectItem value="DAAM">Daam</SelectItem>
                          <SelectItem value="BIGHA">Bigha</SelectItem>
                          <SelectItem value="KATTHA">Kattha</SelectItem>
                          <SelectItem value="DHUR">Dhur</SelectItem>
                          <SelectItem value="SQ_FT">Square Feet</SelectItem>
                          <SelectItem value="SQ_MTR">Square Meter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Price Field */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Month (NPR)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter monthly price"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
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

              {/* Hero Image Upload */}
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

              {/* Gallery Images Upload */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Gallery Images</h3>
                <FileUploadDemo
                  files={files}
                  onFilesChange={setFiles}
                  maxFiles={5}
                />
              </div>

              {/* Lalpurja Upload */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Lalpurja Document</h3>
                <FileUploadDemo
                  files={lalpurjaFile ? [lalpurjaFile] : []}
                  onFilesChange={(files) => setLalpurjaFile(files[0] || null)}
                  maxFiles={1}
                />
              </div>

              {/* Submit Button */}
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
