"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { requestedLeaseInputSchema } from "@/lib/zodschema/schema"; 
import { useSubmitLeaseApplication } from "@/queryandmutation/index"; 

interface LeaseRequestFormProps {
  landId: string;
}

export function LeaseRequestForm({ landId }: LeaseRequestFormProps) {
  const { mutateAsync: submitApplication, isPending } = useSubmitLeaseApplication();

  const form = useForm({
    resolver: zodResolver(requestedLeaseInputSchema),
    defaultValues: {
      landId: landId,
      leaseDurationInMonths: 12,
      // Use empty string initially to avoid "uncontrolled to controlled" error
      proposedMonthlyRent: "" as unknown as number, 
      plans: "",
      additionalMessages: "",
    },
  });

  async function onSubmit(values: any) {
    try {
        console.log("Submitting application with values:", values);
      await submitApplication(values);
      toast.success("Application sent successfully!");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit");
    }
  }

  return (
    <Form {...form}>
      {/* Centering the form with a white card background */}
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6 bg-white dark:bg-zinc-950 p-8 border rounded-xl shadow-sm"
      >
        <input type="hidden" {...form.register("landId")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Duration */}
          <FormField
            control={form.control}
            name="leaseDurationInMonths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lease Duration (Months)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="12"
                    {...field}
                    // Fix: Handle NaN and ensure it stays controlled
                    value={field.value ?? ""} 
                    onChange={(e) => {
                      const val = e.target.valueAsNumber;
                      field.onChange(isNaN(val) ? "" : val);
                    }} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Monthly Rent */}
          <FormField
            control={form.control}
            name="proposedMonthlyRent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposed Monthly Rent ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter amount"
                    {...field}
                    // Fix: Handle NaN and ensure it stays controlled
                    value={field.value ?? ""} 
                    onChange={(e) => {
                      const val = e.target.valueAsNumber;
                      field.onChange(isNaN(val) ? "" : val);
                    }} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Plans */}
        <FormField
          control={form.control}
          name="plans"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Plans</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your intended use for the land..." 
                  className="min-h-[150px] resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Additional Messages */}
        <FormField
          control={form.control}
          name="additionalMessages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Messages (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Notes for the landlord..." 
                  className="resize-none"
                  {...field} 
                  value={field.value ?? ""} // Ensure controlled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12 text-md" disabled={isPending}>
          {isPending ? "Sending..." : "Send Application"}
        </Button>
      </form>
    </Form>
  );
}