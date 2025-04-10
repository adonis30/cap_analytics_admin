import { create } from "zustand";


import axios from "axios";
const url = 'api/v1/auth';
const baseURL = process.env.REACT_APP_BASE_URL;
const API_URL = `${baseURL}/${url}`;

 
console.log("baseurl", API_URL)
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
        const response = await axios.post(`${API_URL}/sign-in`, { email, password });
        set({
            isAuthenticated: true,
            user: response.data.user,
            error: null,
            isLoading: false,
        });
    } catch (error) {
        set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
        throw error;
    }
},

logout: async () => {
    set({ isLoading: true, error: null });
    try {
        await axios.post(`${API_URL}/sign-out`);
        set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
        set({ error: "Error logging out", isLoading: false });
        throw error;
    }
},

checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
        const response = await axios.get(`${API_URL}/check-auth`);
        set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
        set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
},
}));
