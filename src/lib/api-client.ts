import * as SecureStore from "expo-secure-store";
import { API_CONFIG, STORAGE_KEYS } from "../utils/constants";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getHeaders();

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers,
      });
      const json = await response.json();
      return json;
    } catch (err) {
      throw err;
    }
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
