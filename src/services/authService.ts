import { apiClient } from '../lib/api';
import type { LoginRequest, TokenResponse } from '../types/auth';

class AuthService {
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/api/auth/login', credentials);

    // Store the access token in localStorage
    localStorage.setItem('access_token', response.access_token);

    return response;
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}

export const authService = new AuthService();
