// services/auth.service.js
export class AuthService {
    constructor() {
        this.API_BASE = import.meta.env.VITE_API_BASE_URL;
    }

    async login(username, password) {
        try {
            const response = await fetch(`${this.API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Credenciales inválidas');
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