import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AvatarPic() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
