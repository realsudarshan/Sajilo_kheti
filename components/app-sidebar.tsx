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
  IconActivity,
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
import { title } from "process"
import { url } from "inspector"
import { Book, Mail } from "lucide-react"

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
    {
      title:"Blogs",
      url:"/admin/studio",
      icon: Book,
    },
    {title:"Reports",
     url:"/admin/reports",
     icon: IconFileDescription,
    },
    {title:"Analytics",
     url:"/admin/analytics",
     icon: IconMap,
    },
    {title:"Events",
     url:"/admin/events",
     icon: IconActivity,
    },
    {title:"Send mail",
     url:"/admin/mail",
     icon: Mail,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/admin/help",
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
