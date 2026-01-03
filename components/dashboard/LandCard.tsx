import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Landtype } from "@/types/landstype";
import AvatarPic from "./avatar";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Viewmorebutton from "../shared/Viewmorebutton";

export function LandCard({ lands }: { lands: Landtype[] }) {
  if (!lands || lands.length === 0) {
    return (
      <p className="text-sm text-gray-500">No land listings available.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
      {lands.map((land, index) => (
        <Card
          key={`${land.landtitle}-${index}`}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Land photo */}
          <div className="relative w-full h-44">
            <Image
              src={land.landphoto}
              alt={land.landtitle}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">{land.landtitle}</CardTitle>
            <CardDescription className="line-clamp-2">
              {land.landdescription}
            </CardDescription>

            {/* Location */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-muted">
                 <MapPin className="h-4 w-4 text-emerald-600" aria-hidden />
                 <span className="leading-none">{land.landlocation}</span>
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Owner row */}
            <div className="flex items-center gap-3">
              <AvatarPic />
              <div className="leading-tight">
                <p className="text-sm font-medium">{land.landownername}</p>
                <p className="text-xs text-muted-foreground">Land Owner</p>
              </div>
            </div>

            {/* Key details */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Size</span>
              <span className="font-medium">{land.size}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Price</span>
              <span className="font-semibold">{land.pricing}</span>
            </div>
          </CardContent>

        </Card>
      ))}
    </div>
  );
}
