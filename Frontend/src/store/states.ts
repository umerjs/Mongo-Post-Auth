import { create } from "zustand";

interface User {
  _id?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
}

interface StoreState {
  user: User | null;
  isLogin: boolean | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const store = create<StoreState>((set) => ({
  user: null,

  isLogin: null,

  login: (userData: User) => {
    set({
      user: userData,
      isLogin: true,
    });
  },

  logout: () => {
    set({
      user: null,
      isLogin: false,
    });
  },
}));
