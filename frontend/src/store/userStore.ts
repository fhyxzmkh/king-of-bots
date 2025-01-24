import { create } from "zustand";
import axios from "axios";
import { User } from "../types/user";
import { signIn, signOut } from "../utils/auth.tsx";

interface UserState {
  user: User;
  setUser: (newUser: Partial<User>) => void;
  clearUser: () => void;
  login: (username: string, password: string) => Promise<void>;
  getUserInfo: (token: string) => Promise<void>;
}

const initialState: User = {
  id: 0,
  username: "",
  avatar: "",
  token: "",
  is_login: false,
};

const useUserStore = create<UserState>((set, get) => ({
  user: initialState,
  setUser: (newUser) =>
    set((state) => ({ user: { ...state.user, ...newUser } })),
  clearUser: () => set({ user: initialState }),
  login: async (username: string, password: string) => {
    const response = await axios.post(
      "http://101.43.35.186:8686/api/user/account/token",
      null,
      {
        params: {
          username: username,
          password: password,
        },
      },
    );

    const message: string = response.data.message;
    const token: string = response.data.token;

    if (message === "success") {
      await get().getUserInfo(token);
    } else {
      alert("Login failed! Username or password is incorrect.");
    }
  },
  getUserInfo: async (token: string) => {
    try {
      const response = await axios.get(
        //"http://localhost:8686/api/user/account/info",
        "http://101.43.35.186:8686/api/user/account/info",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;

      if (data.message === "success") {
        get().setUser({
          id: data.id,
          username: data.username,
          avatar: data.avatar,
          token: token,
          is_login: true,
        });
        await signIn(token);

        // alert("Login success!");
      } else {
        get().clearUser();
        await signOut();
        alert("Login failed! Please try again.");
      }
    } catch (error) {
      console.error(error);
      get().clearUser();
      await signOut();
      alert("Login failed! Please try again.");
    }
  },
}));

export default useUserStore;
