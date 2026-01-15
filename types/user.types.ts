export interface UserProfile {
  id: number;
  name: string;
  email: string;
  address: string;
  role: 'land owner' | 'land leaser';
  dp: string;
}

// For a collection of these users:
export type UserList = UserProfile[];