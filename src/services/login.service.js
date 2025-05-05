import { storeAuthData, clearAuthData } from '../utils/auth-debug.js';

export class AuthService {
    constructor() {
        this.API_BASE = import.meta.env.VITE_API_BASE_URL;
        console.log('API_BASE:', this.API_BASE); // Log para verificar la URL base
    }

    async login(email, password) {
        try {
            console.log('Intentando login con:', { email, password });
            console.log('URL de login:', `${this.API_BASE}/auth/login`);

            const response = await fetch(`${this.API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            console.log('Respuesta del servidor:', response.status);

            if (!response.ok) {
                let errorMessage = 'Credenciales inválidas';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    if (response.status === 404) {
                        errorMessage = 'El servidor no está disponible. Por favor, verifica que el backend esté corriendo.';
                    } else {
                        errorMessage = response.statusText || errorMessage;
                    }
                }
                throw new Error(errorMessage);
            }

            const responseData = await response.json();
            console.log('Login exitoso:', responseData);
            
            // Guardar token y datos del usuario usando la nueva función
            storeAuthData(responseData);
            
            return responseData;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            if (error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar con el servidor. Por favor, verifica que el backend esté corriendo.');
            }
            throw error;
        }
    }

    async register(userData) {
        try {
            console.log('Intentando registro con:', userData);
            console.log('URL de registro:', `${this.API_BASE}/auth/register`);

            const response = await fetch(`${this.API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            console.log('Respuesta del servidor:', response.status);

            if (!response.ok) {
                let errorMessage = 'Error en el registro';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    if (response.status === 404) {
                        errorMessage = 'El servidor no está disponible. Por favor, verifica que el backend esté corriendo.';
                    } else {
                        errorMessage = response.statusText || errorMessage;
                    }
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Registro exitoso:', data);
            
            // Intentar acceder al token si está disponible en la respuesta (algunos backends lo envían directamente)
            if (data.token || (data.data && data.data.token) || data.access_token) {
                const token = data.token || (data.data && data.data.token) || data.access_token;
                localStorage.setItem('token', token);
                
                // Si hay datos de usuario
                const user = data.user || (data.data && data.data.user);
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                }
            }
            
            return data;
        } catch (error) {
            console.error('Error al registrar:', error);
            if (error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar con el servidor. Por favor, verifica que el backend esté corriendo.');
            }
            throw error;
        }
    }

    // Método para verificar si el usuario está autenticado
    isAuthenticated() {
        // Intentar obtener token de diferentes fuentes
        const token = this.getToken();
        if (!token) return false;

        try {
            // Verificar si el token está expirado
            const payload = this.decodeToken(token);
            if (!payload) return false;
            
            return payload.exp > Date.now() / 1000;
        } catch (e) {
            console.error('Error al verificar autenticación:', e);
            return false;
        }
    }

    // Método para obtener el token actual de cualquier ubicación
    getToken() {
        const token = localStorage.getItem('token') || 
               localStorage.getItem('auth_token') || 
               localStorage.getItem('accessToken');
               
        if (token) {
            // Log para diagnóstico
            console.log('🔑 Token encontrado en localStorage:', {
                length: token.length,
                start: token.substring(0, 10) + '...',
                format: token.includes('.') ? 'JWT válido' : 'Formato no estándar',
                hasBearerPrefix: token.startsWith('Bearer ')
            });
            
            // Retornar token limpio sin el prefijo "Bearer " si lo tiene
            return token.startsWith('Bearer ') ? token.substring(7) : token;
        }
        
        return null;
    }
    
    // Método para decodificar un token JWT
    decodeToken(token) {
        try {
            // Limpiar el prefijo 'Bearer ' si existe
            const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
            
            // Verificar formato válido de JWT (debe tener al menos 2 puntos)
            if (!cleanToken || cleanToken.split('.').length !== 3) {
                console.warn('Formato de token inválido:', cleanToken.substring(0, 10) + '...');
                return null;
            }
            
            // Decodificar payload
            const payload = JSON.parse(atob(cleanToken.split('.')[1]));
            return payload;
        } catch (e) {
            console.error('Error al decodificar token:', e);
            return null;
        }
    }

    // Método para obtener los datos del usuario actual
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Método para verificar si el usuario es admin
    isAdmin() {
        const user = this.getCurrentUser();
        return user && (user.rol === 'admin' || user.role === 'admin' || user.isAdmin === true);
    }

    // Método para verificar permisos específicos
    hasPermission(permission) {
        const user = this.getCurrentUser();
        if (!user) return false;
        
        // Si es admin, tiene todos los permisos
        if (user.rol === 'admin') return true;
        
        // Aquí puedes agregar más lógica de permisos según tus necesidades
        return false;
    }

    // Método para cerrar sesión y limpiar almacenamiento
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        // Redirigir a la página de login si es necesario
        if (window.location.pathname !== '/login.html') {
            window.location.href = '/login.html';
        }
    }
}