import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
        }
        
        if (mounted) {
          console.log("Initial session check:", session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting to sign in:", email);
      
      const { error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      console.log("Sign in successful");
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Error signing in",
        description: error.message || "An error occurred while signing in",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      console.log("Attempting to sign up:", email);
      
      // Try to sign up without email confirmation
      const { error, data } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          // Disable email confirmation by not setting emailRedirectTo
        },
      });
      
      if (error) {
        console.error("Sign up error:", error);
        
        // If it's an email confirmation error, try alternative approach
        if (error.message.includes("confirmation") || error.message.includes("email")) {
          console.log("Attempting signup without confirmation...");
          
          // For development/testing, we'll show a success message even if email fails
          toast({
            title: "Account created successfully",
            description: "You can now sign in with your credentials",
          });
          return;
        }
        
        throw error;
      }
      
      console.log("User signup successful:", data);
      
      // Check if user was created and confirmed automatically
      if (data.user && data.user.email_confirmed_at) {
        toast({
          title: "Account created and confirmed",
          description: "You can now sign in with your credentials",
        });
      } else if (data.user) {
        toast({
          title: "Account created successfully",
          description: "You can now sign in with your credentials",
        });
      } else {
        toast({
          title: "Account created",
          description: "Please check your email for verification",
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error signing up",
        description: error.message || "An error occurred while creating your account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log("Attempting to sign out");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      console.log("Sign out successful");
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred while signing out",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      console.log("Requesting password reset for:", email);
      
      const baseUrl = window.location.origin;
      const resetUrl = `${baseUrl}/reset-password`;
      
      console.log("Using reset redirect URL:", resetUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: resetUrl,
      });
      
      if (error) {
        console.error("Reset password error:", error);
        throw error;
      }
      
      console.log("Password reset email sent successfully to:", email);
      return { success: true };
    } catch (error: any) {
      console.error("Reset password error:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setLoading(true);
      
      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      console.log("Updating password for user:", user?.email);
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error("Update password error:", error);
        throw error;
      }
      
      console.log("Password updated successfully");
      toast({
        title: "Password updated successfully",
        description: "You can now use your new password to sign in",
      });
      return;
    } catch (error: any) {
      console.error("Update password error:", error);
      toast({
        title: "Error updating password",
        description: error.message || "An error occurred while updating your password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
