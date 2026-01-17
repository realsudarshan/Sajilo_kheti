import { generateReactHelpers } from "@uploadthing/react";
import type { ManyImageRouter,SingleImageRouter } from "@/app/api/uploadthing/core";

export const {useUploadThing:useUploadLandMany, uploadFiles:useUploadLandManyFiles } = generateReactHelpers<ManyImageRouter>();
export const {useUploadThing:useUploadLandHero, uploadFiles:useUploadLandHeroFiles } = generateReactHelpers<SingleImageRouter>();