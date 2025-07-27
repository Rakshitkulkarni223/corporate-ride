"use client";

import React, {
  createContext,
  useReducer,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { CONSTANTS } from "../utils/constants";


type User = Record<string, any> | null;

interface AuthState {
  user: User;
  token: string | null;
  expires: string | null;
  isAuthenticated: boolean;
  status: string;
}

type AuthAction =
  | { type: "login"; payload: { user: User; token: string; expires: string } }
  | { type: "logout" }
  | { type: "status"; payload: { status: string } }
  | { type: "updateUser"; payload: Partial<User> };

interface AuthContextType extends AuthState {
  login: (user: User, token: string, expires: string) => void;
  logout: () => void;
  setAuthStatus: (status: string) => void;
  updateUser: (updates: Partial<User>) => void;
}


const initialState: AuthState = {
  user: null,
  token: null,
  expires: null,
  isAuthenticated: false,
  status: CONSTANTS.AUTH_STATUS.PENDING,
};



// Helper functions for localStorage
const saveAuthToLocalStorage = (authData: any) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth', JSON.stringify(authData));
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const getAuthFromLocalStorage = () => {
  try {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('auth');
      return authData ? JSON.parse(authData) : null;
    }
    return null;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return null;
  }
};

const clearAuthFromLocalStorage = () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth');
    }
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  try {
    switch (action.type) {
      case "login": {
        const newState = {
          user: action.payload.user,
          token: action.payload.token,
          expires: action.payload.expires,
          isAuthenticated: true,
          status: CONSTANTS.AUTH_STATUS.SUCCESS,
        };
        // Save to localStorage
        saveAuthToLocalStorage({
          user: action.payload.user,
          token: action.payload.token,
          expires: action.payload.expires
        });
        return newState;
      }
      case "logout": {
        // Clear from localStorage
        clearAuthFromLocalStorage();
        return {
          ...initialState,
          status: CONSTANTS.AUTH_STATUS.IDLE,
        };
      }
      case "status":
        return {
          ...state,
          status: action.payload.status,
        };
      case "updateUser": {
        const updatedUser = { ...state.user, ...action.payload };
        // If we have an authenticated user, update localStorage
        if (state.isAuthenticated) {
          saveAuthToLocalStorage({
            user: updatedUser,
            token: state.token,
            expires: state.expires
          });
        }
        return {
          ...state,
          user: updatedUser,
        };
      }
      default:
        return state;
    }
  } catch (error) {
    console.error('Error in auth reducer:', error);
    return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Get initial state from localStorage if available
  const getInitialState = (): AuthState => {
    try {
      const savedAuth = getAuthFromLocalStorage();
      if (savedAuth?.token) {
        return {
          user: savedAuth.user || null,
          token: savedAuth.token,
          expires: savedAuth.expires || '',
          isAuthenticated: true,
          status: CONSTANTS.AUTH_STATUS.SUCCESS,
        };
      }
    } catch (error) {
      console.error('Error getting initial state:', error);
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(authReducer, getInitialState());

  // Check authentication on initial load
  useEffect(() => {
    try {
      // Verify auth state is consistent
      const savedAuth = getAuthFromLocalStorage();
      
      // If we have a token in localStorage but not in state, restore it
      if (savedAuth?.token && !state.token) {
        try {
          dispatch({
            type: "login",
            payload: {
              user: savedAuth.user || null,
              token: savedAuth.token,
              expires: savedAuth.expires || ''
            }
          });
        } catch (restoreError) {
          console.error('Error restoring auth state:', restoreError);
        }
      } 
      // If we have a token in state but not in localStorage, save it
      else if (state.token && !savedAuth?.token) {
        try {
          saveAuthToLocalStorage({
            user: state.user,
            token: state.token,
            expires: state.expires
          });
        } catch (saveError) {
          console.error('Error saving auth state:', saveError);
        }
      }
    } catch (error) {
      console.error('Error in auth effect:', error);
    }
  }, []);

  const login = useCallback((user: User, token: string, expires: string) => {
    try {
      dispatch({ type: "login", payload: { user, token, expires } });
    } catch (error) {
      console.error('Error in login:', error);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      dispatch({ type: "logout" });
    } catch (error) {
      console.error('Error in logout:', error);
    }
  }, []);

  const setAuthStatus = useCallback((status: string) => {
    try {
      dispatch({ type: "status", payload: { status } });
    } catch (error) {
      console.error('Error setting auth status:', error);
    }
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    try {
      dispatch({ type: "updateUser", payload: updates });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      setAuthStatus,
      updateUser
    }),
    [state, login, logout, setAuthStatus, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
