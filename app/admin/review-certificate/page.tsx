"use client";

import { useGetAllAgreementEscrowsForAdmin, useGetAllEscrowsForAdmin, useVerifyLegalDocuments } from "@/queryandmutation/index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";

export default function ReviewCertificatePage() {
  // Using the custom hooks we defined
  const { data: escrows, isLoading } = useGetAllAgreementEscrowsForAdmin();
  const { mutate: verify, isPending: isProcessing } = useVerifyLegalDocuments();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-emerald-600" />
      </div>
    );
  }

  // Filtering data for the two tabs
  const pending = escrows?.filter((e) => e.status === "HOLDING") || [];
  const history = escrows?.filter((e) => e.status === "RELEASED") || [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          Admin Legal Review
        </h1>
        <p className="text-muted-foreground font-medium">
          Review Malpot documents and release held escrow funds to owners.
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] bg-slate-100">
          <TabsTrigger value="pending" className="font-bold">
            Needs Action ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="font-bold">
            History ({history.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <EscrowTable 
            data={pending} 
            onAction={(id, act) => verify({ escrowId: id, action: act })} 
            isProcessing={isProcessing}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <EscrowTable data={history} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Sub-component for the data table
function EscrowTable({ 
  data, 
  onAction, 
  isProcessing 
}: { 
  data: any[], 
  onAction?: (id: string, action: "APPROVE" | "REJECT") => void,
  isProcessing?: boolean 
}) {
  return (
    <div className="border rounded-[1.2rem] bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="font-bold h-14">Parties Involved</TableHead>
            <TableHead className="font-bold">Land Details</TableHead>
            <TableHead className="font-bold">Legal Documents</TableHead>
            <TableHead className="font-bold text-right">Verification</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-24 text-gray-400 font-medium">
                No escrow records found in this category.
              </TableCell>
            </TableRow>
          ) : (
            data.map((escrow) => (
              <TableRow key={escrow.id} className="hover:bg-slate-50/30 transition-colors">
                <TableCell className="py-5">
                  <div className="space-y-1">
                    <p className="font-black text-slate-900 leading-none">
                      {escrow.owner?.name} <span className="text-[10px] text-slate-400 uppercase font-bold ml-1">Owner</span>
                    </p>
                    <p className="font-bold text-emerald-600 text-sm leading-none">
                      {escrow.leaser?.name} <span className="text-[10px] text-slate-400 uppercase font-bold ml-1">Leaser</span>
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-bold text-sm text-slate-800">{escrow.application?.land?.title}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{escrow.application?.land?.location}</p>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs font-bold border-slate-200"
                      onClick={() => window.open(escrow.landownerMalpotUrl, '_blank')}
                    >
                      <FileText className="h-3.5 w-3.5 mr-1.5 text-emerald-600" /> Owner Paper
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs font-bold border-slate-200"
                      onClick={() => window.open(escrow.landleaserMalpotUrl, '_blank')}
                    >
                      <FileText className="h-3.5 w-3.5 mr-1.5 text-blue-600" /> Leaser Paper
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {onAction ? (
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 font-black h-9 px-4"
                        onClick={() => onAction(escrow.id, "REJECT")}
                        disabled={isProcessing}
                      >
                        <XCircle className="mr-2 h-4 w-4" /> REJECT
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700 font-black h-9 px-4 shadow-sm"
                        onClick={() => onAction(escrow.id, "APPROVE")}
                        disabled={isProcessing}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> VERIFY & PAY
                      </Button>
                    </div>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 font-black">
                      RELEASED
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}