import { LeaseRequestForm } from "@/components/lands/LeaseRequestForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    // min-h-screen and flex items-center centers it vertically
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl"> 
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Submit Lease Application</h1>
          <p className="text-muted-foreground mt-2">
            Applying for Land: <span className="font-mono font-bold text-primary">{id}</span>
          </p>
        </div>
        
        <LeaseRequestForm landId={id} />
      </div>
    </div>
  );
}