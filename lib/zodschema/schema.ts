"use client"
 
import { z } from "zod"
 
export const landlistSchema = z.object({
 location: z.string().min(1, "Location is required"),
 size: z.number().min(1, "Size must be at least 1").max(10000, "Size too large"),
 landpic: z.string().optional(),
 morelandpic: z.array(z.any()).optional(),
 price: z.number().min(1, "Price must be at least 1"),
 description: z.string().min(3, "Description must be at least 3 characters").max(500, "Description too long"),
})
export const VerifyOwnerSchema = z.object({
  FullName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  Adress:z.string(),
  frontcitizenshippic: z.string(),
 backcitizenshippic: z.string(),
 citizenshipno:z.string()
})