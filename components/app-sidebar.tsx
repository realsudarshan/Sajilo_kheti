"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconCertificate,
  IconCurrencyRupeeNepalese,
  IconFileDescription,
  IconHelp,
  IconInnerShadowTop,
  IconMap,
  IconSearch,
  IconSettings,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "List Users",
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      title: "List Lands",
      url: "/admin/lands",
      icon: IconMap,
    },
    {
      title: "List Leases",
      url: "/admin/leases",
      icon: IconFileDescription,
    },
    {
      title: "Review Landowner",
      url: "/admin/review-landowner",
      icon: IconUserCheck,
    },
    {
      title: "Review Land Certificate",
      url: "/admin/review-certificate",
      icon: IconCertificate,
    },
    {
      title: "Transactions",
      url: "/admin/transactions",
      icon: IconCurrencyRupeeNepalese,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/admin">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SajiloKheti</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
