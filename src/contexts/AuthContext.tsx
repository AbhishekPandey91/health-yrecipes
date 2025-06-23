
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  height?: string;
  weight?: string;
  healthGoals?: string;
  preferences?: string[];
  allergies?: string[];
  deficiencies?: string[];
  cuisineType?: string;
  skillLevel?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: any) => Promise<void>;
  signOut: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Demo user for testing - in real app this would come from Supabase
  const demoUser: User = {
    id: '1',
    name: 'Alex Thompson',
    email: 'alex@example.com',
    age: 30,
    height: "5'8\"",
    weight: '160 lbs',
    healthGoals: 'Weight loss and muscle gain',
    preferences: ['chicken', 'pasta', 'vegetables'],
    allergies: ['peanuts'],
    deficiencies: ['iron'],
    cuisineType: 'Italian',
    skillLevel: 'intermediate'
  };

  useEffect(() => {
    // Check if user is logged in (in real app, check Supabase session)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call - in real app, use Supabase auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
    } catch (error) {
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: any) => {
    setIsLoading(true);
    try {
      // Simulate API call - in real app, use Supabase auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUser = { ...demoUser, ...userData, id: Math.random().toString() };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      signUp,
      signOut,
      updateUser,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
