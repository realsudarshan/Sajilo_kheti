import { generateReactHelpers } from "@uploadthing/react";
import type { CitizenshipbackpicRouter, CitizenshipfrontpicRouter, ManyImageRouter,SingleImageRouter, } from "@/app/api/uploadthing/core";

export const {useUploadThing:useUploadLandMany, uploadFiles:useUploadLandManyFiles } = generateReactHelpers<ManyImageRouter>();
export const {useUploadThing:useUploadLandHero, uploadFiles:useUploadLandHeroFiles } = generateReactHelpers<SingleImageRouter>();
export const {useUploadThing:useCitizenshipfrontpic, uploadFiles:useUploadCitizenshipfrontpic } = generateReactHelpers<CitizenshipfrontpicRouter>();
export const {useUploadThing:useCitizenshipbackpic, uploadFiles:useUploadCitizenshipbackpic } = generateReactHelpers<CitizenshipbackpicRouter>();