import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";

// Import the type of your router from the core file
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// This is the hook you use in your forms
export const { useUploadThing } = generateReactHelpers<OurFileRouter>();