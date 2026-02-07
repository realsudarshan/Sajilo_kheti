export interface LandType {
  landtitle: string;
  landdescription: string;
  landlocation: string;
  landownername: string;
  landphoto: string;
  landownerphoto: string;
  pricing: string;
  purpose: string;
  size: string;
}
type LandStatus = "leased" | "on marketplace" | "none" | "agreement pending";

// @/types/land.types.ts
export type Land = {
  id: string;
  title: string;          // Error says this exists
  location: string;
  status: "AVAILABLE" | "IN_NEGOTIATION" | "LEASED" | "HIDDEN";
  description: string;
  ownerId: string;
  galleryUrls: string[];
  lalpurjaUrl: string | null;
  createdAt: string;
  updatedAt: string;
  // If 'size' and 'ownername' aren't in the error list, 
  // they might be named differently (e.g., 'area' or 'owner.name')
};