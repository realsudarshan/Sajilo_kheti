import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 container mx-auto px-4 lg:px-6 py-8">
                {children}
            </main>
        </div>
    )
}
