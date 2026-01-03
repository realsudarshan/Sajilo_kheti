/**
 * Dashboard Message Boxes Data
 * Contains message box configurations for dashboard sections
 * Easy to integrate with backend APIs
 */

export interface DashboardMessageBox {
  id: string
  title: string
  location: string
  symbol: string // emoji or icon name
  description: string
  status: "pending" | "approved" | "active"
  color: "blue" | "green" | "yellow"
}

/**
 * Application Sent Message Box
 */
export const applicationSentMessage: DashboardMessageBox = {
  id: "msg-app-1",
  title: "Mountain View Land",
  location: "Kathmandu, Nepal",
  symbol: "📋",
  description: "Applications you have sent to land owners.",
  status: "pending",
  color: "blue",
}

/**
 * Active Leasers Message Box
 */
export const activeLeasersMessage: DashboardMessageBox = {
  id: "msg-active-1",
  title: "Productive Farmland",
  location: "Lalitpur, Nepal",
  symbol: "🏠",
  description: "Active leasers currently leasing lands.",
  status: "active",
  color: "green",
}

/**
 * Pending Request Message Box
 */
export const pendingRequestMessage: DashboardMessageBox = {
  id: "msg-pending-1",
  title: "Riverside Property",
  location: "Chitwan, Nepal",
  symbol: "⏳",
  description: "Requests pending approval.",
  status: "pending",
  color: "yellow",
}
