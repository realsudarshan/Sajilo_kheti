import { useQuery } from "@tanstack/react-query"
import { getUsers, getLands } from "@/lib/api"

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })
}

export function useLands() {
  return useQuery({
    queryKey: ["lands"],
    queryFn: getLands,
  })
}
