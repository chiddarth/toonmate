import { CharacterType } from './index';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name: string;
  password?: string;
  avatar: string;
  favoriteCharacter: CharacterType;
  createdAt: string;
  lastLoginAt: string;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  favoriteCharacter: CharacterType;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: AuthUser;
}
