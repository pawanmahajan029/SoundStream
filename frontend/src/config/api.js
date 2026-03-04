import axios from 'axios';
import { resetAuth } from '../store/authSlice';

const API_URL = import.meta.env.VITE_API_URL || '/api';      // Get the API URL from environment variables, fallback for local dev proxy

const api = axios.create({                         // Create an axios instance with default config
    baseURL: API_URL,                              // = /api right now in .env, during deployment, while uploading .env we will change it's value to the actual backend URL
    withCredentials: true,                         // ⭐VERY VERY IMPORTANT⭐ (NEVER FORGET THIS otherwise nothing will work) (Keep it true as it is crucial for sending/receiving cookies)
    headers: {
        'Content-Type': 'application/json',        // Description: below export statement
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
            if (window.store) {
                window.store.dispatch(resetAuth());
            }
        }
        return Promise.reject(error);
    }
);

export default api;

/*# Axios is a popular HTTP client library that makes it easier to make requests to servers. Think of it like a messenger 📬

Here's a simple explanation: 

Q1. What is Axios?

• It's a tool to make HTTP requests (GET, POST, PUT, DELETE)
• Like fetch (built into browsers) but with more features

Q2. Why Axios overcame Fetch?

• Automatic JSON parsing (no need for .json())
• Better error handling
• Request/response interceptors
• Works in both browser and Node.js
• Simpler syntax

Q3. How to use Axios?

// GET request
api.get('/users');

// POST request
api.post('/login', { username: 'john', password: '123' });

// PUT request
api.put('/users/1', { name: 'John Updated' });

// DELETE request
api.delete('/users/1');

*/

/* Let me explain headers in HTTP requests, particularly the one we're using:

Think of headers like a label on a package 📦:

• Content-Type: This header tells the server what kind of data we're sending
• 'application/json' means "Hey server, I'm sending JSON data!"

It's like telling the server "Please expect data in this format: { "username": "john", "password": "123" }"

Q. Why we need it:

• When you submit forms or send data from frontend
• Your data might look like: { username: "john", password: "123" }
• This header ensures the server knows to parse it as JSON
• Without it, the server might not understand how to read your data

In our case, we're mainly sending JSON data for login/register/etc., therefore we kept 'Content-Type': 'application/json' as the default header.
*/