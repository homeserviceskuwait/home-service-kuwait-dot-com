import { supabase } from './supabase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'super_admin';
}

class AuthService {
  private currentUser: AuthUser | null = null;

  // Login using Supabase Auth
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      console.log('Attempting login with:', { email: credentials.email, passwordLength: credentials.password.length });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password
      });

      if (error) {
        console.error('Supabase auth error:', error);
        throw new Error('Invalid email or password');
      }

      if (!data.user) {
        throw new Error('Login failed: No user data returned');
      }

      // Check if user is in admin_users table
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', data.user.email)
        .single();

      if (!adminUser || adminError) {
        console.warn('User not found in admin_users table, using auth user data');
        // Fallback to auth user if not in admin table
        return {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || 'Admin',
          role: 'admin'
        };
      }

      const authUser: AuthUser = {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      };

      this.currentUser = authUser;
      localStorage.setItem('authUser', JSON.stringify(authUser));

      return authUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.currentUser = null;
      localStorage.removeItem('authUser');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  getCurrentUser(): AuthUser | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to get from localStorage first
    const stored = localStorage.getItem('authUser');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('authUser');
        return null;
      }
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(role: 'admin' | 'super_admin'): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    if (role === 'super_admin') {
      return user.role === 'super_admin';
    }

    return user.role === 'admin' || user.role === 'super_admin';
  }

  // Initialize auth state from localStorage
  initializeAuth(): void {
    this.getCurrentUser();
  }
}

export const authService = new AuthService();
export default authService;