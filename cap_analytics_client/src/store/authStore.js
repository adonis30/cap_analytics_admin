import { create } from "zustand";
import axios from "axios";

// Config
const baseURL = process.env.REACT_APP_BASE_URL;
if (!baseURL) throw new Error("REACT_APP_BASE_URL is not defined in your environment");

const API_URL = `${baseURL}/api/v1/auth`;
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
      const res = await axios.post(`${API_URL}/sign-in`, { email, password });
      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw err;
    }
  },

  register: async (email, password, firstName, lastName) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/sign-up`, {
        email,
        password,
        firstName,
        lastName,
      });
      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/sign-out`);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: "Logout failed",
        isLoading: false,
      });
      throw err;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/check-auth`);
      set({
        user: res.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },
}));
