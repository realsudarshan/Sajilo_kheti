"use client"

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  useGetAllApplications, 
  useAcceptLeaseApplication, 
  useRejectLeaseApplication 
} from "@/queryandmutation/index"; 
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { 
  Loader2, 
  User, 
  MapPin, 
  Calendar, 
  ArrowRight,
  Inbox,
  ArrowLeft,
  Check,
  X,
  Info
} from "lucide-react";

export default function LandApplicationsPage() {
  const { id: landId } = useParams() as { id: string };
  const router = useRouter();

  const { data, isLoading, refetch } = useGetAllApplications({ landId });

  const { mutateAsync: acceptApp, isPending: isAccepting } = useAcceptLeaseApplication();
  const { mutateAsync: rejectApp, isPending: isRejecting } = useRejectLeaseApplication();

  const applications = data?.applications || [];
  const landInfo = applications.length > 0 ? applications[0].land : null;

  // Helper to define status colors
  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACCEPTED':
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case 'REJECTED':
        return "bg-red-100 text-red-700 border-red-200";
      case 'PENDING':
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleAction = async (applicationId: string, action: 'ACCEPT' | 'REJECT') => {
    try {
      if (action === 'ACCEPT') {
        await acceptApp({ applicationId });
        toast.success("Application accepted successfully!");
      } else {
        await rejectApp({ applicationId });
        toast.info("Application rejected.");
      }
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      
      {/* 1. Land Info Hero Section */}
      {landInfo && (
        <div className="relative overflow-hidden rounded-3xl border bg-white dark:bg-zinc-950 shadow-sm">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-48 md:h-auto md:w-72 shrink-0">
              <img 
                src={landInfo.heroImageUrl} 
                alt={landInfo.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-6 flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Link href="/landowner-dashboard/my-lands" className="flex items-center text-xs text-emerald-600 font-bold mb-2 hover:underline">
                    <ArrowLeft className="mr-1 h-3 w-3" /> MY LANDS
                  </Link>
                  <h1 className="text-2xl font-bold tracking-tight">{landInfo.title}</h1>
                  <p className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="mr-1 h-3.5 w-3.5 text-emerald-500" /> {landInfo.location}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize px-4 py-1 border-emerald-500 text-emerald-600">
                  {landInfo.status.replace('_', ' ').toLowerCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2 border-t border-dashed">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Monthly Price</p>
                  <p className="font-bold text-gray-900">{landInfo.pricePerMonth.toLocaleString()} <span className="text-xs font-normal">/mo</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Total Area</p>
                  <p className="font-bold text-gray-900">{landInfo.sizeInSqmeter.toLocaleString()} m²</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Applications List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Review Applications 
          <span className="text-sm font-normal text-muted-foreground">({applications.length})</span>
        </h2>

        {applications.length > 0 ? (
          applications.map((app) => (
            <Card key={app.id} className={`group transition-all duration-300 shadow-sm overflow-hidden bg-white dark:bg-zinc-950 ${app.status === 'ACCEPTED' ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'hover:border-gray-400'}`}>
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row items-stretch">
                  
                  {/* Farmer Profile & Status Badge */}
                  <div className="p-6 flex-1 flex items-start gap-4">
                    <Avatar className="h-14 w-14 rounded-2xl border-2 border-white shadow-sm">
                      <AvatarImage src={app.leaser?.image || ""} className="object-cover" />
                      <AvatarFallback className="bg-emerald-50 text-emerald-700 rounded-xl">
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between lg:justify-start gap-3">
                        <h3 className="font-bold text-lg group-hover:text-emerald-600 transition-colors">
                          {app.leaser?.name || "Farmer Applicant"}
                        </h3>
                        {/* THE STATUS BADGE */}
                        <Badge variant="secondary" className={`text-[10px] uppercase tracking-wider font-bold ${getStatusConfig(app.status)}`}>
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 italic pr-4 bg-gray-50 dark:bg-zinc-900/50 p-2 rounded-lg border border-dashed">
                        "{app.plans}"
                      </p>
                    </div>
                  </div>

                  {/* Terms Summary */}
                  <div className="px-8 py-6 bg-gray-50/30 dark:bg-zinc-900/50 border-y lg:border-y-0 lg:border-x border-gray-100 dark:border-zinc-800 flex flex-row lg:flex-col justify-around lg:justify-center gap-4 min-w-[200px]">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Proposed Rent</span>
                      <span className="font-bold text-base text-emerald-600">
                        {app.proposedMonthlyRent.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">/mo</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Duration</span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                        <span className="font-bold text-sm">{app.leaseDurationInMonths} Months</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="p-6 flex flex-row lg:flex-col items-center justify-center gap-2 min-w-[160px]">
                    {app.status === 'PENDING' ? (
                      <>
                        <div className="flex gap-2 w-full">
                          <Button 
                            variant="outline" 
                            size="icon"
                            title="Reject"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-10"
                            onClick={() => handleAction(app.id, 'REJECT')}
                            disabled={isAccepting || isRejecting}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                          <Button 
                            size="icon"
                            title="Accept"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10"
                            onClick={() => handleAction(app.id, 'ACCEPT')}
                            disabled={isAccepting || isRejecting}
                          >
                            {isAccepting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                          </Button>
                        </div>
                        <Link href={`/landowner-dashboard/my-lands/${landId}/applications/${app.id}`} className="w-full">
                          <Button variant="ghost" size="sm" className="w-full text-xs font-semibold">
                            Full Details <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Link href={`/landowner-dashboard/my-lands/${landId}/applications/${app.id}`} className="w-full">
                        <Button variant="outline" className="w-full rounded-xl gap-2 font-semibold border-gray-200">
                          <Info className="h-4 w-4 text-blue-500" /> View History
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl bg-gray-50/30 text-center">
            <Inbox className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">No applications found</h3>
          </div>
        )}
      </div>
    </div>
  );
}