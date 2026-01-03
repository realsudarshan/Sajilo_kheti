/**
 * Message Box Component
 * Displays a box with title, location, symbol, and description
 */

import { DashboardMessageBox } from "@/data/dashboardMessageBoxes"
import { MapPin } from "lucide-react"

interface MessageBoxProps {
  messageBox: DashboardMessageBox
}

export function MessageBox({ messageBox }: MessageBoxProps) {
  const colorStyles = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      symbol: "text-blue-600",
      title: "text-blue-900",
      desc: "text-blue-700",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      symbol: "text-green-600",
      title: "text-green-900",
      desc: "text-green-700",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      symbol: "text-yellow-600",
      title: "text-yellow-900",
      desc: "text-yellow-700",
    },
  }

  const styles = colorStyles[messageBox.color]

  return (
    <div
      className={`p-6 rounded-lg border ${styles.bg} ${styles.border} mb-4`}
    >
      {/* Symbol */}
      <div className={`text-4xl mb-3 ${styles.symbol}`}>
        {messageBox.symbol}
      </div>

      {/* Title */}
      <h3 className={`text-lg font-semibold mb-2 ${styles.title}`}>
        {messageBox.title}
      </h3>

      {/* Location */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className={`h-4 w-4 ${styles.symbol}`} />
        <span className={`text-sm ${styles.desc}`}>{messageBox.location}</span>
      </div>

   
      {/* Status Badge */}
      <div className="mt-4">
        <span
          className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
            messageBox.status === "pending"
              ? "bg-yellow-200 text-yellow-800"
              : messageBox.status === "active"
                ? "bg-green-200 text-green-800"
                : "bg-blue-200 text-blue-800"
          }`}
        >
          {messageBox.status.charAt(0).toUpperCase() +
            messageBox.status.slice(1)}
        </span>
      </div>
    </div>
  )
}
