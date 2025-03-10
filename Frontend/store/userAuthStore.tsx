import {create} from "zustand";
import { instance } from "../lib/axios";

interface AuthStore {
    user: {
        username: string;
        email: string;
    } | null;
    isAuthenticated: boolean;
    isLogin: boolean;
    signup: (username: string, email: string, password: string) => Promise<boolean>;
    signin: (email: string, password: string) => Promise<boolean>;
}

export const userAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isLogin: false,

    signup: async (username: string, email: string, password: string) => {
        try {
            const response = await instance.post("/api/v1/user/signup", { username, email, password });
            set({ user: response.data, isAuthenticated: true, isLogin: true });
            return true;
        } catch (error) {
            console.error("Signup failed:", error);
            return false;
        }
    },

    signin: async (email: string, password: string) => {
        try {
            const response = await instance.post("/api/v1/user/signin", { email, password });
            set({ user: response.data, isAuthenticated: true, isLogin: true });
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    },
}));

