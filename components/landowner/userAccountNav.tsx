"use client"

import { IconDotsVertical, IconLogout, IconUserCircle } from "@tabler/icons-react"
import { useClerk, useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function UserAccountNav() {
  const { signOut } = useClerk()
  const { user } = useUser()

  const initials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.emailAddresses?.[0]?.emailAddress?.slice(0, 2).toUpperCase() ?? "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 px-2 h-12 hover:bg-gray-100 rounded-xl transition-all">
          <Avatar className="h-9 w-9 rounded-lg border border-gray-200">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? ""} />
            <AvatarFallback className="rounded-lg bg-emerald-50 text-emerald-700 font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-gray-900">{user?.fullName ?? "User"}</span>
            <span className="text-muted-foreground truncate text-xs">
              {user?.emailAddresses?.[0]?.emailAddress ?? ""}
            </span>
          </div>
          <IconDotsVertical className="ml-2 size-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 mt-2 p-2 rounded-xl" align="end">
        <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Account</p>
                <p className="text-xs leading-none text-muted-foreground">Manage your settings</p>
            </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer py-2 rounded-lg">
          <IconUserCircle className="mr-2 size-4" />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => signOut({ redirectUrl: "/" })} 
          className="text-red-600 cursor-pointer py-2 rounded-lg focus:bg-red-50 focus:text-red-600"
        >
          <IconLogout className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}