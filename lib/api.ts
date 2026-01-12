import axios from "axios"

const BASE_URL = "https://bee4d5d1-ade0-47fd-9697-f6bdbb23cb58.mock.pstmn.io"

const api = axios.create({
  baseURL: BASE_URL,
})

export async function getUsers() {
  const { data } = await api.get("/users")
  return data
}

export async function getLands() {
  const { data } = await api.get("/lands")
  return data
}
