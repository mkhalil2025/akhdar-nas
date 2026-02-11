import apiClient from './api';
import { LoginRequest, LoginResponse, User } from '../types/auth';

export const authService = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    async getCurrentUser(): Promise<User | null> {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;

        try {
            // In a real app, you'd have a /me endpoint
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch {
            return null;
        }
    },

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    },
};
