/**
 * Status Badge Component
 * Displays status badges using shadcn Badge component
 */

import { Badge } from "@/components/ui/badge"

interface StatusProps {
  variant?: "pending" | "success" | "cancel"
  className?: string
}

export function Status({ variant = "pending", className = "" }: StatusProps) {
  const variants = {
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100",
    },
    success: {
      label: "Success",
      className: "bg-green-100 text-green-800 border-green-300 hover:bg-green-100",
    },
    cancel: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800 border-red-300 hover:bg-red-100",
    },
  }

  const status = variants[variant]

  return (
    <Badge variant="outline" className={`${status.className} ${className}`}>
      {status.label}
    </Badge>
  )
}
