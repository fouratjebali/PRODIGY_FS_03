import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  profileImageUrl?: string;
  emailVerified?: boolean; // Add email verification status
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (data: { username: string; email: string }) => Promise<void>;
  verifyEmail: () => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');

    fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(error => {
      console.error('Error during logout:', error);
    });
  };

  const updateUser = async (data: { username: string; email: string }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update user information');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user information:', error);
      throw error;
    }
  };

  const verifyEmail = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }

      const updatedUser = { ...user, emailVerified: true };
      setUser(updatedUser as User);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateUser,
        verifyEmail,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};