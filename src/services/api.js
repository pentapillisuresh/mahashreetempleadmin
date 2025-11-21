// Direct API calls without proxy
const BASE_URL = 'http://localhost:3000/api';

console.log('API Service initialized with URL:', BASE_URL);

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    console.log('Making API request to:', url, 'with options:', config);

    try {
      const response = await fetch(url, config);
      
      // Check if response is HTML (error case)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        console.error('Server returned HTML instead of JSON. Full response:', text.substring(0, 500));
        throw new Error(`Server returned HTML instead of JSON. This usually means the endpoint doesn't exist or there's a server error.`);
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response not OK:', response.status, errorText);
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      // Handle empty responses
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0' || response.status === 204) {
        return { message: 'Success' };
      }

      const data = await response.json();
      console.log('API response received:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(`Network error: ${error.message}`);
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();