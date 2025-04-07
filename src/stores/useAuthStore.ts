// frontend/src/stores/useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // For persisting state to localStorage

// Define the User interface (can be shared or redefined here)
interface User {
    id: number;
    email: string;
    first_name: string;
    surname?: string; // Optional based on your needs/DB
    role: string;
    // Add other relevant fields from your user object
}

// Define the state structure and actions
interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean; // To track initial loading from storage
    setUserAndToken: (user: User, token: string) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
}

// Create the store using Zustand
// Use persist middleware to save/load state from localStorage
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Initial state
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true, // Start loading initially

            // Action to set user and token (e.g., after login)
            setUserAndToken: (user, token) => {
                set({ user, token, isAuthenticated: true, isLoading: false });
                console.log('Auth state updated:', { user, token: token ? '***' : null }); // Log state update
            },

            // Action to clear user and token (e.g., after logout or auth error)
            clearAuth: () => {
                set({ user: null, token: null, isAuthenticated: false, isLoading: false });
                console.log('Auth state cleared.');
            },

            // Action to manually control loading state if needed
            setLoading: (loading) => {
                console.log('Setting loading state to:', loading);
                set({ isLoading: loading });
            },

        }),
        {
            name: 'auth-storage', // Name of the item in localStorage
            storage: createJSONStorage(() => localStorage), // Use localStorage
            // Only persist user and token, derive isAuthenticated on load
            partialize: (state) => ({ user: state.user, token: state.token }),
            // Rehydrate logic (runs once on load)
            onRehydrateStorage: () => {
                console.log('Rehydrating auth state from storage...');
                return (state, error) => {
                    if (error) {
                        console.error('Failed to rehydrate auth state:', error);
                        state?.setLoading(false); // Stop loading even on error
                    } else if (state) {
                        // If token and user exist in storage, mark as authenticated
                        const isAuthenticated = !!state.token && !!state.user;
                        state.isAuthenticated = isAuthenticated;
                        console.log('Rehydration complete. Authenticated:', isAuthenticated);
                    }
                    // Always finish initial loading after rehydration attempt
                    state?.setLoading(false);
                }
            }
        }
    )
);

// Optional: Initialize loading state check on first import (client-side only)
if (typeof window !== 'undefined') {
    // Set a timeout to ensure loading state is set to false even if rehydration fails
    setTimeout(() => {
        const currentState = useAuthStore.getState();
        if (currentState.isLoading) {
            console.log('Forcing loading state to false after timeout');
            currentState.setLoading(false);
        }
    }, 2000); // 2 second timeout
}