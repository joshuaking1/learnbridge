import { useAuthStore } from '@/stores/useAuthStore';

/**
 * Utility function to debug authentication state
 * Call this from the browser console to check auth state
 */
export function debugAuthState() {
  const state = useAuthStore.getState();
  console.log('=== AUTH STATE DEBUG ===');
  console.log('Loading:', state.isLoading);
  console.log('Authenticated:', state.isAuthenticated);
  console.log('User:', state.user);
  console.log('Token exists:', !!state.token);
  console.log('=======================');
  
  // Check localStorage directly
  try {
    const storedAuth = localStorage.getItem('auth-storage');
    console.log('Raw localStorage data:', storedAuth);
    
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      console.log('Parsed localStorage data:', parsed);
    }
  } catch (error) {
    console.error('Error reading localStorage:', error);
  }
  
  return state;
}

/**
 * Force reset the authentication state
 * Call this from the browser console to reset auth state
 */
export function resetAuthState() {
  const state = useAuthStore.getState();
  state.clearAuth();
  console.log('Auth state has been reset');
  return useAuthStore.getState();
}

// Make these functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuthState;
  (window as any).resetAuth = resetAuthState;
} 