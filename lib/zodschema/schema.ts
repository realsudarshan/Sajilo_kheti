"use client"

import { z } from "zod"

export const LandUnitSchema = z.enum([
  "ROPANI", "AANA", "PAISA", "DAAM",
  "BIGHA", "KATTHA", "DHUR",
  "SQ_FT", "SQ_MTR"
])

export const landlistSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  size: z.object({
    size: z.number().min(1, "Size must be at least 1"),
    unit: LandUnitSchema,
  }),
  price: z.number().min(1, "Price must be at least 1"),
  description: z.string().min(3, "Description must be at least 3 characters").max(500, "Description too long"),
  landpic: z.string().optional(),
  morelandpic: z.array(z.string()).optional(),
  lalpurjaUrl: z.string().optional(),
})
export const VerifyOwnerSchema = z.object({
  FullName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  Adress: z.string(),
  frontcitizenshippic: z.string(),
  backcitizenshippic: z.string(),
  citizenshipno: z.string()
})