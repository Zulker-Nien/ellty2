const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiClient {
    private token: string | null = null;

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getToken(): string | null {
        if (!this.token && typeof window !== 'undefined') {
            this.token = localStorage.getItem('token');
        }
        return this.token;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const headers = new Headers({
            'Content-Type': 'application/json',
        });

        if (options.headers) {
            const existing = options.headers;
            if (existing instanceof Headers) {
                existing.forEach((value, key) => headers.append(key, value));
            } else if (Array.isArray(existing)) {
                existing.forEach(([key, value]) => headers.append(key, value));
            } else {
                Object.entries(existing).forEach(([key, value]) => headers.append(key, value));
            }
        }

        const token = this.getToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'An error occurred' }));
            throw new Error(error.message || 'An error occurred');
        }

        return response.json();
    }

    async register(username: string, password: string) {
        return this.request<{ access_token: string; user: any }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    }

    async login(username: string, password: string) {
        return this.request<{ access_token: string; user: any }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    }

    async getDiscussions() {
        return this.request<any[]>('/discussions');
    }

    async createDiscussion(startingNumber: number) {
    return this.request<any>('/discussions', {
        method: 'POST',
        body: JSON.stringify({ startingNumber }),
    });
}

async addOperation(parentId: string, operation: string, operand: number) {
    return this.request<any>('/discussions/operation', {
        method: 'POST',
        body: JSON.stringify({ parentId, operation, operand }),
    });
}
}

export const apiClient = new ApiClient();