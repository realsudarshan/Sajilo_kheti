import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";

// Import the type of your router from the core file
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// These components are now aware of "citizenship", "selfie", etc.
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// This is the hook you use in your forms
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();