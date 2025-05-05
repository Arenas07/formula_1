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
                throw new Error('Credenciales inválidas');
            }

            const data = await response.json();
            
            // Guardar token y datos del usuario
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token_id', data.token_id);
            
            // Guardar permisos específicos para fácil acceso
            if (data.user && data.user.permisos) {
                localStorage.setItem('user_permisos', JSON.stringify(data.user.permisos));
            }
            
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

    // Método para verificar si el usuario tiene un permiso específico
    hasPermission(permission) {
        const permisos = JSON.parse(localStorage.getItem('user_permisos') || '{}');
        return permisos[permission] === true;
    }

    // Método para verificar si el usuario es admin
    isAdmin() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.rol === 'admin';
    }

    // Método para obtener todos los permisos del usuario
    getUserPermissions() {
        return JSON.parse(localStorage.getItem('user_permisos') || '{}');
    }

    // Método para cerrar sesión
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_id');
        localStorage.removeItem('user_permisos');
    }
}