const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const getToken = () => {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'token') return value;
  }
  console.log("API - No token found in cookies");
  return null;
};

// A function to safely clear token
const clearToken = () => {
  console.log("API - Clearing auth token due to 401 error");
  try {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; secure";
  } catch (error) {
    console.error("Error clearing token:", error);
  }
};

export class ApiError extends Error {
  status: number;
  responseData?: any;

  constructor(message: string, status: number, responseData?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.responseData = responseData;
  }
}

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    console.log(`API GET ${endpoint} - Token present: ${!!token}`);

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log(`API GET ${endpoint} - 401 Unauthorized, clearing token`);
          clearToken();
        }
        
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: 'Unknown error occurred' };
        }
        
        console.error(`API GET ${endpoint} - Error:`, {
          status: response.status,
          message: errorData.message || `HTTP error! status: ${response.status}`,
        });
        
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`, 
          response.status,
          errorData
        );
      }

      return response.json();
    } catch (error) {
      console.error(`API GET ${endpoint} - Fetch error:`, error);
      throw error;
    }
  },

  async post<T, D extends Record<string, unknown>>(endpoint: string, data: D): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; secure";
      }
      
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: 'Unknown error occurred' };
      }
      
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`, 
        response.status,
        errorData
      );
    }

    return response.json();
  },

  async patch<T, D extends Record<string, unknown>>(endpoint: string, data: D): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; secure";
      }
      
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: 'Unknown error occurred' };
      }
      
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`, 
        response.status,
        errorData
      );
    }

    return response.json();
  },

  async put<T, D extends Record<string, unknown>>(endpoint: string, data: D): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; secure";
      }
      
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: 'Unknown error occurred' };
      }
      
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`, 
        response.status,
        errorData
      );
    }

    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; secure";
      }
      
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: 'Unknown error occurred' };
      }
      
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`, 
        response.status,
        errorData
      );
    }

    return response.json();
  },
}; 