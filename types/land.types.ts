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

export interface Land {
  id: number;
  location: string;
  size: string;
  ownername: string;
  status: LandStatus;
}