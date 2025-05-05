import { AuthService } from '../../services/login.service';

export async function fetchWithAuth(url, options = {}) {
    const authService = new AuthService();
    const token = authService.getToken();

    // Si no hay token y no estamos en la página de login, redirigir al login
    if (!token && !window.location.pathname.includes('login.html')) {
        window.location.href = '/login.html';
        throw new Error('No autenticado');
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    try {
        const response = await fetch(url, { ...options, headers });

        // Si el token expiró o es inválido
        if (response.status === 401) {
            authService.logout();
            throw new Error('Sesión expirada');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la petición');
        }

        return response;
    } catch (error) {
        if (error.message === 'No autenticado' || error.message === 'Sesión expirada') {
            throw error;
        }
        throw new Error('Error en la petición: ' + error.message);
    }
} 