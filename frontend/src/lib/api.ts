const BASE_URL = typeof window !== 'undefined' 
  ? `http://${window.location.hostname}:5084`
  : 'http://localhost:5084';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const stored = localStorage.getItem('user');
    const token = stored ? JSON.parse(stored).token : null;
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Terjadi kesalahan pada server');
    }

    return response.json();
}
