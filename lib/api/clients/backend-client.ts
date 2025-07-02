interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  queryParams?: Record<string, string>;
}

interface ApiError {
  message: string[];
  error: string;
  statusCode: number;
}

export class BackendClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (!this.baseUrl) throw new Error('API URL not configured');
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    };
  }

  private async fetchWrapper<T>(url: string, options: RequestOptions): Promise<T> {
    try {
      const queryString = options.queryParams
        ? `?${new URLSearchParams(options.queryParams).toString()}`
        : '';

      const response = await fetch(`${this.baseUrl}${url}${queryString}`, {
        method: options.method,
        headers: this.getHeaders(),
        body: options.data ? JSON.stringify(options.data) : undefined
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message?.[0] || 'Request failed');
      }

      return response.json();
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('An unexpected error occurred');
    }
  }

  async get<T>(url: string, queryParams?: Record<string, string>): Promise<T> {
    return this.fetchWrapper<T>(url, { method: 'GET', queryParams });
  }

  async post<T>(url: string, data: any): Promise<T> {
    return this.fetchWrapper<T>(url, { method: 'POST', data });
  }

  async put<T>(url: string, data: any): Promise<T> {
    return this.fetchWrapper<T>(url, { method: 'PUT', data });
  }

  async delete<T>(url: string): Promise<T> {
    return this.fetchWrapper<T>(url, { method: 'DELETE' });
  }
}