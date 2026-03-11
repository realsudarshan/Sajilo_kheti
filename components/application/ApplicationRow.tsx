"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, Calendar, Check, X, 
  MessageSquare, Map, Landmark, ShieldCheck, Loader2, ExternalLink 
} from "lucide-react";

interface ApplicationRowProps {
  app: any;
  landId: string;
  chatChannelId?: string;
  hasEscrow: boolean;
  isAccepting: boolean;
  isRejecting: boolean;
  onAction: (id: string, action: "ACCEPT" | "REJECT") => void;
  getStatusConfig: (status: string) => string;
}

export function ApplicationRow({
  app,
  landId,
  chatChannelId,
  hasEscrow,
  isAccepting,
  isRejecting,
  onAction,
  getStatusConfig,
}: ApplicationRowProps) {
  return (
    <div className="group flex flex-col lg:flex-row items-start lg:items-center justify-between p-5 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50/50 transition-colors">
      
      {/* 1. Applicant Identity */}
      <div className="flex items-center gap-4 min-w-[280px]">
        <Avatar className="h-12 w-12 rounded-full border-2 border-white shadow-sm">
          <AvatarImage src={app.leaser?.image || ""} className="object-cover" />
          <AvatarFallback className="bg-emerald-50 text-emerald-700">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">
            {app.leaser?.name || "Farmer Applicant"}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`text-[9px] px-1.5 py-0 uppercase font-bold tracking-tight ${getStatusConfig(app.status)}`}>
              {app.status}
            </Badge>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
              <Calendar className="h-3 w-3" /> {app.leaseDurationInMonths} Months
            </span>
          </div>
        </div>
      </div>

      {/* 2. Proposal Content */}
      <div className="mt-4 lg:mt-0 flex-1 lg:px-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 italic italic mb-1">
          "{app.plans}"
        </p>
        <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-emerald-600">
                Rs. {app.proposedMonthlyRent.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">/mo</span>
            </span>
        </div>
      </div>

      {/* 3. Dynamic Action Buttons */}
      <div className="mt-4 lg:mt-0 flex flex-wrap items-center gap-2">
        {app.status === "PENDING" ? (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
              onClick={() => onAction(app.id, "REJECT")}
              disabled={isAccepting || isRejecting}
            >
              <X className="h-4 w-4 mr-1.5" /> Reject
            </Button>
            <Button 
              size="sm" 
              className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
              onClick={() => onAction(app.id, "ACCEPT")}
              disabled={isAccepting || isRejecting}
            >
              {isAccepting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4 mr-1.5" /> Accept</>}
            </Button>
          </div>
        ) : hasEscrow ? (
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Actions for Active Leases */}
            <Button variant="outline" size="sm" className="h-9 text-xs border-gray-200 rounded-lg" asChild>
               <a href={`https://www.google.com/maps/search/Malpot+Office+near+${app.land.location}`} target="_blank" rel="noreferrer">
                 <Landmark className="h-3.5 w-3.5 mr-1.5 text-amber-600" /> Malpot Office
               </a>
            </Button>
            
            <Button variant="outline" size="sm" className="h-9 text-xs border-gray-200 rounded-lg" asChild>
                <a href={`https://www.google.com/maps/search/${app.land.location}`} target="_blank" rel="noreferrer">
                    <Map className="h-3.5 w-3.5 mr-1.5 text-blue-500" /> Go to Land
                </a>
            </Button>

            <Button variant="outline" size="sm" className="h-9 text-xs border-gray-200 rounded-lg">
               <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-600" /> Verify Land
            </Button>

            {chatChannelId && (
              <Button 
                size="sm" 
                className="h-9 bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                onClick={() => (document.querySelector('[aria-label="Open chat"]') as HTMLElement)?.click()}
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Chat
              </Button>
            )}
          </div>
        ) : null}

        {/* Always show History/Full Details icon */}
        <Link href={`/landowner-dashboard/my-lands/${landId}/applications/${app.id}`}>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-emerald-600 rounded-full" title="View Details">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}