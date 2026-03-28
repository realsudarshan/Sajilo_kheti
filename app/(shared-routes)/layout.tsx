import { SharedLayout } from "@/components/layout/SharedLayout";

export default function SharedRoutesLayout({ children }: { children: React.ReactNode }) {
  return <SharedLayout>{children}</SharedLayout>;
}
