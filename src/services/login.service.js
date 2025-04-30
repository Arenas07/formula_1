// services/auth.service.js
export class AuthService {
    constructor() {
        this.API_BASE = import.meta.env.VITE_API_BASE_URL;
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al iniciar sesión');
            }

            const data = await response.json();
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await fetch(`${this.API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Error en el registro');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al registrar:', error);
            throw error;
        }
    }
}