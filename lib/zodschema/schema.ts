"use client"
 
import { z } from "zod"
 
export const landlistSchema = z.object({
 location: z.string(),
 size:z.number().min(10).max(1000),
 landpic:z.url(),
 morelandpic:z.array(z.string().url()).optional(),
 price:z.number().min(5000),
 description:z.string().min(10).max(500),
})