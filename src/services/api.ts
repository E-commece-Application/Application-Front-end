const API_URL = "http://localhost:3000";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Handle password validation errors
    if (data.errors && Array.isArray(data.errors)) {
      throw new Error(data.errors.join(", "));
    }
    throw new Error(data.message || "Une erreur est survenue");
  }
  
  return data;
};

export const authAPI = {
  register: async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);

    // Save token and user to localStorage
    if (data.success && data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  },

  login: async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);

    // Save token and user to localStorage
    if (data.success && data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  },

  forgotPassword: async ({ email }: { email: string }) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return handleResponse(response);
  },

  checkResetToken: async ({ code }: { code: string }) => {
    const response = await fetch(`${API_URL}/auth/check-reset-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    return handleResponse(response);
  },

  resetPassword: async (code: string, { password, confirmPassword }: { password: string; confirmPassword: string }) => {
    const response = await fetch(`${API_URL}/auth/reset-password/${code}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, confirmPassword }),
    });

    return handleResponse(response);
  },
};

