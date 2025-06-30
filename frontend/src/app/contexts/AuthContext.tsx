"use client";

import React, {
  createContext,
  useReducer,
  useCallback,
  useContext,
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



const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "login":
      return {
        user: action.payload.user,
        token: action.payload.token,
        expires: action.payload.expires,
        isAuthenticated: true,
        status: CONSTANTS.AUTH_STATUS.SUCCESS,
      };
    case "logout":
      return {
        ...initialState,
        status: CONSTANTS.AUTH_STATUS.IDLE,
      };
    case "status":
      return {
        ...state,
        status: action.payload.status,
      };
    case "updateUser":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback((user: User, token: string, expires: string) => {
    dispatch({ type: "login", payload: { user, token, expires } });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "logout" });
  }, []);

  const setAuthStatus = useCallback((status: string) => {
    dispatch({ type: "status", payload: { status } });
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    dispatch({ type: "updateUser", payload: updates });
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
