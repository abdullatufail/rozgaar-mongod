"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, authService } from "../services/auth";
import { useToast } from "../components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastAuthAttempt, setLastAuthAttempt] = useState<number>(0);
  const router = useRouter();
  const { toast } = useToast();

  const fetchUser = async () => {
    // Prevent excessive auth calls - only try if it's been at least 2 seconds since last attempt
    const now = Date.now();
    if (now - lastAuthAttempt < 2000) {
      console.log("Auth context - Skipping auth check, too recent:", { 
        timeSinceLastAttempt: now - lastAuthAttempt + "ms",
        minimumInterval: "2000ms" 
      });
      return;
    }
    
    setLastAuthAttempt(now);
    
    // Check if token exists in cookies
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    
    console.log("Auth context - fetchUser called:", { 
      hasToken: !!token,
      tokenLength: token ? token.length : 0
    });
    
    if (!token) {
      console.log("Auth context - No token found, setting user to null");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      console.log("Auth context - Token found, fetching current user");
      const user = await authService.getCurrentUser();
      console.log("Auth context - User fetched successfully:", { 
        userId: user.id,
        role: user.role
      });
      setUser(user);
    } catch (error) {
      // Don't show error toast for 401 or missing token, it's expected when not logged in
      if (error instanceof Error && 
          !error.message.includes("401") && 
          !error.message.includes("No token found")) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data",
          variant: "destructive",
        });
      } else {
        console.log("Auth context - Error fetching user (normal for auth issues):", 
          error instanceof Error ? error.message : "Unknown error");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  const login = async (email: string, password: string) => {
    try {
      const { user } = await authService.login(email, password);
      setUser(user);
      
      // Get the return URL from localStorage if it exists (user was trying to access a specific page)
      const returnUrl = localStorage.getItem('returnUrl');
      
      if (returnUrl) {
        // Clear the returnUrl from localStorage after using it
        localStorage.removeItem('returnUrl');
        router.push(returnUrl);
      } else {
        // Default redirect to dashboard if no return URL
        router.push("/dashboard");
      }
      
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      throw error;
    }
  };
  const register = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    try {
      const { user } = await authService.register(
        name,
        email,
        password,
        role
      );
      setUser(user);
      
      // Get the return URL from localStorage if it exists
      const returnUrl = localStorage.getItem('returnUrl');
      
      if (returnUrl) {
        // Clear the returnUrl from localStorage after using it
        localStorage.removeItem('returnUrl');
        router.push(returnUrl);
      } else {
        // Default redirect to dashboard if no return URL
        router.push("/dashboard");
      }
      
      toast({
        title: "Success",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; secure";
    setUser(null);
    router.push("/");
    toast({
      title: "Success",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 