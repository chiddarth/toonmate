import { AuthResponse, AuthUser, LoginCredentials, RegisterData } from '../types/auth';

const STORAGE_KEYS = {
  USERS: 'toonmate_auth_users_v1',
  CURRENT_USER: 'toonmate_current_user_v1',
  REMEMBER_ME: 'toonmate_remember_me_v1',
};

// Seed default initial user for immediate testing
const DEFAULT_SEED_USER: AuthUser = {
  id: 'user_chidd_001',
  username: 'chidd',
  email: 'chidd@toonmate.app',
  name: 'Chidd',
  password: 'password123',
  avatar: '🐼',
  favoriteCharacter: 'panda',
  createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  lastLoginAt: new Date().toISOString(),
};

class AuthService {
  private users: AuthUser[] = [];
  private currentUser: AuthUser | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        this.users = [DEFAULT_SEED_USER];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      }

      const storedCurrent = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedCurrent) {
        this.currentUser = JSON.parse(storedCurrent);
      } else {
        // By default, set the seed user as current active session
        this.currentUser = DEFAULT_SEED_USER;
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_SEED_USER));
      }
    } catch {
      this.users = [DEFAULT_SEED_USER];
      this.currentUser = DEFAULT_SEED_USER;
    }
  }

  getUsers(): AuthUser[] {
    return this.users.map(({ password: _, ...user }) => user as AuthUser);
  }

  getCurrentUser(): AuthUser | null {
    if (!this.currentUser) return null;
    const { password: _, ...safeUser } = this.currentUser;
    return safeUser as AuthUser;
  }

  register(data: RegisterData): AuthResponse {
    const name = data.name.trim();
    const username = data.username.trim().toLowerCase();
    const email = data.email.trim().toLowerCase();
    const password = data.password;

    // Validation
    if (!name) {
      return { success: false, error: 'Please enter your full name.' };
    }

    if (!username || username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long.' };
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      return { success: false, error: 'Username can only contain letters, numbers, dashes, and underscores.' };
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (password !== data.confirmPassword) {
      return { success: false, error: 'Passwords do not match!' };
    }

    // Check for existing username or email
    const usernameExists = this.users.some(u => u.username.toLowerCase() === username);
    if (usernameExists) {
      return { success: false, error: `Username "@${username}" is already taken. Please pick another.` };
    }

    const emailExists = this.users.some(u => u.email.toLowerCase() === email);
    if (emailExists) {
      return { success: false, error: `An account with email "${email}" already exists. Try logging in.` };
    }

    const characterAvatars: Record<string, string> = {
      panda: '🐼',
      robot: '🤖',
      cat: '🐱',
      dog: '🐶',
      fox: '🦊',
      superhero: '🦸',
      shinchan: '👦',
      doraemon: '🐱',
      pikachu: '⚡',
      luffy: '🍖',
      hattori: '🥷',
    };

    const newUser: AuthUser = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name,
      username,
      email,
      password,
      avatar: characterAvatars[data.favoriteCharacter] || '✨',
      favoriteCharacter: data.favoriteCharacter || 'panda',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.saveUsers();

    this.currentUser = newUser;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

    const { password: _, ...safeUser } = newUser;
    return { success: true, user: safeUser as AuthUser };
  }

  login(credentials: LoginCredentials): AuthResponse {
    const query = credentials.usernameOrEmail.trim().toLowerCase();
    const password = credentials.password;

    if (!query) {
      return { success: false, error: 'Please enter your username or email.' };
    }

    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    const user = this.users.find(
      u => u.username.toLowerCase() === query || u.email.toLowerCase() === query
    );

    if (!user) {
      return { success: false, error: 'No account found with this username or email.' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    user.lastLoginAt = new Date().toISOString();
    this.saveUsers();

    this.currentUser = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

    if (credentials.rememberMe) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, user.username);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    }

    const { password: _, ...safeUser } = user;
    return { success: true, user: safeUser as AuthUser };
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  updateCurrentUser(updates: Partial<AuthUser>): AuthUser | null {
    if (!this.currentUser) return null;

    const index = this.users.findIndex(u => u.id === this.currentUser?.id);
    if (index === -1) return null;

    this.currentUser = { ...this.currentUser, ...updates };
    this.users[index] = this.currentUser;

    this.saveUsers();
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));

    const { password: _, ...safeUser } = this.currentUser;
    return safeUser as AuthUser;
  }

  private saveUsers() {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
    } catch (err) {
      console.error('Failed to save users to storage', err);
    }
  }
}

export const authService = new AuthService();
