
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  department?: string;
  completedTasks?: number;
  totalTasks?: number;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  updateUserProfile: (userData: Partial<User>) => void;
  notifications: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'deadline' | 'task' | 'update';
    read: boolean;
  }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<UserContextType['notifications']>([
    {
      id: '1',
      title: 'Project deadline approaching',
      description: 'Marketing Campaign is due in 3 days',
      date: new Date().toISOString(),
      type: 'deadline',
      read: false
    },
    {
      id: '2',
      title: 'New task assigned',
      description: 'Sarah assigned you a new design task',
      date: new Date().toISOString(),
      type: 'task',
      read: false
    },
    {
      id: '3',
      title: 'Team meeting scheduled',
      description: 'Weekly standup tomorrow at 10 AM',
      date: new Date().toISOString(),
      type: 'update',
      read: true
    }
  ]);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password
      if (email && password) {
        const newUser: User = {
          id: "user1",
          name: email.split('@')[0].replace(/\./g, ' ').replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2),
          email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`,
          completedTasks: 24,
          totalTasks: 30,
        };
        
        // Special case for Sarah Mitchell
        if (email.toLowerCase() === 'sarah.mitchell@timeflow.com') {
          newUser.name = "Sarah Mitchell";
          newUser.avatar = "https://randomuser.me/api/portraits/women/44.jpg";
          newUser.role = "UI/UX Designer";
          newUser.department = "Design";
        }
        
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        throw new Error("Please provide both email and password");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUserProfile = (userData: Partial<User>) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      error, 
      isLoggedIn: !!user,
      updateUserProfile,
      notifications
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
