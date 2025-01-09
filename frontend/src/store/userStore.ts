import { create } from "zustand";
import { User } from "../types/user.ts";

interface UserState {
  user: User;
  setUser: (newUser: Partial<User>) => void;
  clearUser: () => void;
}

const initialState: User = {
  id: 0,
  username: "",
  avatar: "",
  token: "",
  is_login: false,
};

const useUserStore = create<UserState>((set) => ({
  user: initialState,
  setUser: (newUser) =>
    set((state) => ({ user: { ...state.user, ...newUser } })),
  clearUser: () => set({ user: initialState }),
}));

export default useUserStore;
