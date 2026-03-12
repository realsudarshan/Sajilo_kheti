"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetEscrowById, useSubmitMalpotPapers } from "@/queryandmutation";
import { useUploadThing } from "@/lib/useUploadthings";
import { FileUploadDemo } from "@/components/landowner/uploadfile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, SendHorizontal, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function VerifyAgreementPage() {
  const { escrowId } = useParams();
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);

  const { data: escrow, isLoading: loadingEscrow } = useGetEscrowById(escrowId as string);
  const { mutate: submitToDb, isPending: isSavingToDb } = useSubmitMalpotPapers();

  const { startUpload, isUploading } = useUploadThing("malpotPaperUploader", {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        submitToDb({
          escrowId: escrowId as string,
          malpotPaperUrl: res[0].ufsUrl,
        });
      }
    },
    onUploadError: (e) => {
      toast.error(`Cloud upload failed: ${e.message}`);
    },
  });

  const handleFinalSubmit = async () => {
    if (files.length === 0) {
      toast.error("Please select a file first");
      return;
    }
    await startUpload(files);
  };

  if (loadingEscrow) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  const isProcessing = isUploading || isSavingToDb;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <Button variant="ghost" onClick={() => router.back()} className="rounded-full">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Submit Agreement</h1>
        <p className="text-muted-foreground">
          Upload the signed Malpot papers for{" "}
          <span className="text-foreground font-medium">
            {escrow?.application.land.title}
          </span>
          .
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Left Side: Upload UI */}
        <div className="md:col-span-3 space-y-6">
          <FileUploadDemo
            files={files}
            onFilesChange={setFiles}
            maxFiles={1}
          />

          <Button
            className="w-full h-12 text-lg font-semibold"
            onClick={handleFinalSubmit}
            disabled={files.length === 0 || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <SendHorizontal className="mr-2 h-5 w-5" />
                Submit to Admin
              </>
            )}
          </Button>
        </div>

        {/* Right Side: Status Info */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-4 border-dashed bg-muted/30">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              Submission Status
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Landowner:</span>
                <span
                  className={
                    escrow?.landownerMalpotUrl
                      ? "text-emerald-600 font-medium"
                      : "text-amber-600 font-medium"
                  }
                >
                  {escrow?.landownerMalpotUrl ? "Uploaded" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Landleaser:</span>
                <span
                  className={
                    escrow?.landleaserMalpotUrl
                      ? "text-emerald-600 font-medium"
                      : "text-amber-600 font-medium"
                  }
                >
                  {escrow?.landleaserMalpotUrl ? "Uploaded" : "Pending"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

