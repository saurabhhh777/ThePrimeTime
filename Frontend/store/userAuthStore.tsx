import {create} from "zustand";
import { instance } from "../lib/axios";

interface Blog {
    id:number;
    title: string;
    content: string;
    userId:string;
    createdAt:string;
}

interface AuthStore {
    user: {
        username: string;
        email: string;
    } | null;
    isAuthenticated: boolean;
    isLogin: boolean;
    signup: (username: string, email: string, password: string) => Promise<boolean>;
    signin: (email: string, password: string) => Promise<boolean>;
    createBlog: (title: string, content: string) => Promise<void>;
    getAllBlogs: () => Promise<Blog[]>;
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

    getAllBlogs: async () => {
        try {
            const response = await instance.get("/api/v1/blogs");
            console.log("Blogs fetched successfully from userAuthStore:", response.data);
            console.log(response.data); 
            return response.data;
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
            return null;
        }
    },

    createBlog: async (title: string, content: string) => {
        try {
            const response = await instance.post("/api/v1/blogs", { title, content });
            console.log("Blog created successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Failed to create blog:", error);
            return null;
        }   

    }

}));

