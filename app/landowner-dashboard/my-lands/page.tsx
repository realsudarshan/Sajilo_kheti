"use client";

import React from "react";
import { useLands, useGetMe } from "@/queryandmutation/index";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Plus, 
  Maximize2, 
  Pencil, 
  ExternalLink, 
  AlertCircle 
} from "lucide-react";
import Link from "next/link";

// Mapping status to colors for better UX
const statusStyles: Record<string, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  UNVERIFIED: "bg-amber-100 text-amber-700 border-amber-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
  IN_NEGOTIATION: "bg-blue-100 text-blue-700 border-blue-200",
  LEASED: "bg-slate-100 text-slate-700 border-slate-200",
  HIDDEN: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function MyLandsPage() {
  const { data: me } = useGetMe();
  const { data: lands, isLoading } = useLands();

  // Filter: Only show lands belonging to this specific landowner
  const myLands = lands?.filter((land) => land.ownerId === me?.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">My Properties</h1>
          <p className="text-muted-foreground">Manage your listed lands and check verification status.</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700 shadow-md">
          <Link href="/landowner-dashboard/list-land">
            <Plus className="mr-2 h-4 w-4" /> List New Land
          </Link>
        </Button>
      </div>

      {myLands && myLands.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myLands.map((land) => (
            <Card key={land.id} className="group overflow-hidden border-slate-200 transition-all hover:shadow-xl hover:border-blue-300">
              
              {/* Clicking the main area navigates to the land's application page */}
              <Link href={`/my-lands/${land.id}/applications`} className="block">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={land.heroImageUrl || "/placeholder.jpg"} 
                    alt={land.title} 
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge 
                    className={`absolute top-3 right-3 border ${statusStyles[land.status] || ""}`}
                    variant="outline"
                  >
                    {land.status}
                  </Badge>
                </div>

                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center text-xs font-semibold text-blue-600 mb-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {land.location}
                  </div>
                  <CardTitle className="text-xl line-clamp-1">{land.title}</CardTitle>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Price/Month</span>
                      <span className="text-lg font-bold text-slate-900">{formatPrice(land.pricePerMonth)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium bg-slate-100 px-2 py-1 rounded">
                      <Maximize2 className="h-4 w-4 text-slate-500" />
                      <span>{land.sizeInSqmeter.toFixed(2)} m²</span>
                    </div>
                  </div>

                  {land.status === "REJECTED" && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 rounded-md border border-red-100 text-red-600 text-xs">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <p>Verification failed. Please check your Lalpurja document or contact support.</p>
                    </div>
                  )}
                </CardContent>
              </Link>

              {/* Action Footer: These are separate buttons so they don't trigger the application link */}
              <CardFooter className="p-4 border-t bg-slate-50/50 flex gap-3">
                <Button variant="outline" size="sm" className="flex-1 bg-white" asChild>
                  <Link href={`/landowner-dashboard/edit/${land.id}`}>
                    <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-white" asChild>
                  <Link href={`/lands/${land.id}`} target="_blank">
                    <ExternalLink className="h-3.5 w-3.5 mr-2" /> View
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-3xl bg-slate-50">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Plus className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">No lands listed yet</h3>
          <p className="text-muted-foreground mb-6 max-w-xs text-center">
            You haven't uploaded any land properties for lease. Start now to reach potential leasers.
          </p>
          <Button asChild>
            <Link href="/landowner-dashboard/publish">List Your First Land</Link>
          </Button>
        </div>
      )}
    </div>
  );
}