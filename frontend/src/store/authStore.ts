import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: any | null; // Todo: type User
  login: (token: string, user: any) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token: string, user: any) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage",
    }
  ) as any
);

export default useAuthStore;
