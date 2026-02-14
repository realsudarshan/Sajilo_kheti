"use client"

import { z } from 'zod'

export const LandSizeSchema = z.discriminatedUnion("system", [
  z.object({
    system: z.literal("HILLY"), // Hilly region (Kathmandu, etc.)
    ropani: z.number().min(0),
    aana: z.number().min(0).max(15.99),
    paisa: z.number().min(0).max(3.99),
    daam: z.number().min(0).max(3.99),
  }),
  z.object({
    system: z.literal("TERAI"), // Terai region
    bigha: z.number().min(0),
    kattha: z.number().min(0).max(19.99),
    dhur: z.number().min(0).max(19.99),
  }),
  z.object({
    system: z.literal("FLAT"), // Simple units
    value: z.number().positive("Size must be a positive number"),
    unit: z.enum(["SQ_FT", "SQ_MTR"]),
  }),
])

export const publishLandInputSchema = z.object({
  title: z.string().min(5, "Title is too short").max(100),
  location: z.string().min(1, "Location is required"),
  size: LandSizeSchema,
  price: z.number().positive("Price must be greater than 0"),
  description: z.string().min(10, "Please provide a more detailed description"),
  landpic: z.string().url("Hero image URL is required"),
  morelandpic: z.array(z.string().url()).default([]),
  lalpurjaUrl: z.string().url().optional().nullable(),
})

export type LandFormData = z.infer<typeof publishLandInputSchema>
export type LandSize = z.infer<typeof LandSizeSchema>

export const VerifyOwnerSchema = z.object({
  FullName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  Adress: z.string(),
  frontcitizenshippic: z.string(),
  backcitizenshippic: z.string(),
  citizenshipno: z.string()
})