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
            
            if (responseData.success && responseData.data) {
                // Guardar token y datos del usuario
                localStorage.setItem('token', responseData.data.token);
                localStorage.setItem('user', JSON.stringify(responseData.data.user));
                return responseData.data;
            } else {
                throw new Error('Formato de respuesta inválido');
            }
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
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            // Verificar si el token está expirado
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } catch {
            return false;
        }
    }

    // Método para obtener el token actual
    getToken() {
        return localStorage.getItem('token');
    }

    // Método para obtener los datos del usuario actual
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Método para verificar si el usuario es admin
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.rol === 'admin';
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

    // Método para cerrar sesión
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }
}