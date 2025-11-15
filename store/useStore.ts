import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import { User, DiscussionNode } from '@/lib/types';

interface StoreState {
    user: User | null;
    token: string | null;
    discussions: DiscussionNode[];
    loading: boolean;
    error: string | null;
    initialized: boolean,

    register: (username: string, password: string) => Promise<void>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    initializeAuth: () => void;

    fetchDiscussions: () => Promise<void>;
    createDiscussion: (startingNumber: number) => Promise<void>;
    addOperation: (parentId: string, operation: string, operand: number) => Promise<void>;

    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
    user: null,
    token: null,
    discussions: [],
    loading: false,
    error: null,
    initialized: false,


    initializeAuth: () => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                apiClient.setToken(token);
                set({ user, token, initialized: true });
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ initialized: true });
            }
        } else {
            set({ initialized: true });
        }
    },
    register: async (username: string, password: string) => {
        try {
            set({ loading: true, error: null });
            const response = await apiClient.register(username, password);
            apiClient.setToken(response.access_token);
            set({
                user: response.user,
                token: response.access_token,
                loading: false
            });
            await get().fetchDiscussions();
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    login: async (username: string, password: string) => {
        try {
            set({ loading: true, error: null });
            const response = await apiClient.login(username, password);
            apiClient.setToken(response.access_token);
            set({
                user: response.user,
                token: response.access_token,
                loading: false
            });
            await get().fetchDiscussions();
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    logout: () => {
        apiClient.setToken(null);
        set({ user: null, token: null });
    },

    fetchDiscussions: async () => {
        try {
            set({ loading: true, error: null });
            const discussions = await apiClient.getDiscussions();
            set({ discussions, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    createDiscussion: async (startingNumber: number) => {
        try {
            set({ loading: true, error: null });
            await apiClient.createDiscussion(startingNumber);
            await get().fetchDiscussions();
            set({ loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    addOperation: async (parentId: string, operation: string, operand: number) => {
        try {
            set({ loading: true, error: null });
            await apiClient.addOperation(parentId, operation, operand);
            await get().fetchDiscussions();
            set({ loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
}));