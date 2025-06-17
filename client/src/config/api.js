// API Configuration
const API_BASE_URL = 'http://localhost/TO-DO-LIST/server';

// Default fetch options
const defaultOptions = {
    credentials: 'include',
    mode: 'cors',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

// Helper function to make API requests
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const fetchOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, fetchOptions);
        
        // Handle CORS preflight
        if (response.status === 0) {
            throw new Error('CORS error: Unable to access the API. Please check your server configuration.');
        }

        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'An error occurred');
            }
            return data;
        } else {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned invalid response format');
        }
    } catch (error) {
        console.error('API request error:', error);
        if (error.message.includes('CORS')) {
            throw new Error('Unable to connect to the server. Please check your server configuration and try again.');
        }
        throw error;
    }
};

// Helper function for file uploads
export const uploadFile = async (endpoint, formData) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: formData,
        headers: {
            'Accept': 'application/json',
        },
    };

    try {
        const response = await fetch(url, options);
        
        // Handle CORS preflight
        if (response.status === 0) {
            throw new Error('CORS error: Unable to access the API. Please check your server configuration.');
        }

        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }
            return data;
        } else {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned invalid response format');
        }
    } catch (error) {
        console.error('File upload error:', error);
        if (error.message.includes('CORS')) {
            throw new Error('Unable to connect to the server. Please check your server configuration and try again.');
        }
        throw error;
    }
}; 