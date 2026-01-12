const BASE_URL = "https://bee4d5d1-ade0-47fd-9697-f6bdbb23cb58.mock.pstmn.io"

export async function getUsers() {
  const response = await fetch(`${BASE_URL}/users`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`)
  }
  
  return response.json()
}

export async function getLands() {
  const response = await fetch(`${BASE_URL}/lands`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch lands: ${response.statusText}`)
  }
  
  return response.json()
}
