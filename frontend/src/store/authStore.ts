import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id?: number | string;
  username: string;
  email: string;
  height?: number | null;
  weight?: number | null;
  age?: number | string | null;
  date_of_birth?: string | null;
  activity_level?: number | null;
  gender?: string | null;
  otp_enabled?: boolean;
  avatar_url?: string | null;
  role?: string;
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token: string, user: User | null) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage",
    }
  ) as any
);

export default useAuthStore;
