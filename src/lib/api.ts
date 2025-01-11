type RequestData = FormData | Record<string, unknown>;

export const api = {
  async get<T>(url: string): Promise<T> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  async post<T>(url: string, data?: RequestData): Promise<T> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    let body: RequestData | string | undefined = data;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      body = data ? JSON.stringify(data) : undefined;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },
}; 