interface GroupedErrors {
  [key: string]: string[];
}

const groupErrors = (apiError: ApiErrorResponse | null): GroupedErrors => {
  if (!apiError?.message) return {};

  return apiError.message.reduce((grouped, errorMsg) => {
    // Encuentra el nombre del campo (todo lo que está antes de "should" o "must")
    const fieldName = errorMsg.split(/\s+/)[0];

    // Si el campo ya existe, añade el mensaje, si no, crea un nuevo array
    if (!grouped[fieldName]) {
      grouped[fieldName] = [];
    }
    grouped[fieldName].push(errorMsg);

    return grouped;
  }, {} as GroupedErrors);
};

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  queryParams?: Record<string, string>;
}

interface ApiErrorResponse {
  message: string[];
  error: string;
  statusCode: number;
}

class ApiError extends Error {
  statusCode: number;
  errors: GroupedErrors;

  constructor(message: string, errors: GroupedErrors, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
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
        const errorData: ApiErrorResponse = await response.json();
        throw new ApiError('Request failed', groupErrors(errorData), errorData.statusCode);
      }

      return response.json();
    } catch (error) {
      throw error instanceof ApiError
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