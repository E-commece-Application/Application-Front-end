// Use direct URL to avoid proxy issues and ad blockers
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Types
export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface CheckResetTokenData {
  code: string;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API Request:', url, options.method || 'GET');
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Check if response is ok before trying to parse JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error: any) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le port 5000.');
    }
    throw error;
  }
};

// API Functions
export const authAPI = {
  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      localStorage.setItem('token', response.token);
    }

    return response;
  },

  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      localStorage.setItem('token', response.token);
    }

    return response;
  },

  // Forgot Password
  forgotPassword: async (data: ForgotPasswordData): Promise<{ success: boolean; message: string }> => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Check Reset Token
  checkResetToken: async (data: CheckResetTokenData): Promise<{ success: boolean; message: string; email?: string }> => {
    return apiRequest('/auth/check-reset-token', {
      method: 'POST',
      body: JSON.stringify({ code: data.code }),
    });
  },

  // Reset Password
  resetPassword: async (code: string, data: ResetPasswordData): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/auth/reset-password/${code}`, {
      method: 'POST',
      body: JSON.stringify({
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    });
  },

  // Get Current User
  getCurrentUser: async (): Promise<{ success: boolean; user: any }> => {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  },

  // Update Current User
  updateCurrentUser: async (data: { email?: string; nom?: string; password?: string }): Promise<{ success: boolean; message: string; user: any }> => {
    return apiRequest('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('token');
  },
};

