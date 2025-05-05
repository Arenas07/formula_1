export async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    
    if (!token) {
        console.error('No se encontró token de autenticación');
        window.location.href = '/src/modules/login/loginView.html';
        throw new Error('No hay sesión activa');
    }
    
    const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    try {
        const response = await fetch(url, { ...options, headers });
        
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/src/modules/login/loginView.html';
            throw new Error('Sesión expirada o no autorizada');
        }
        
        return response;
    } catch (error) {
        console.error('Error en fetchWithAuth:', error);
        throw error;
    }
}

export class SimulacionService {
    constructor() {
        this.API_BASE = import.meta.env.VITE_API_BASE_URL;
    }

    async crearSimulacion(configuracion) {
        const response = await fetchWithAuth(`${this.API_BASE}/api/simulacion/configuraciones`, {
            method: 'POST',
            body: JSON.stringify(configuracion)
        });
        if (!response.ok) throw new Error('Error al crear la simulación');
        return await response.json();
    }

    async ejecutarSimulacion(configuracion) {
        const response = await fetchWithAuth(`${this.API_BASE}/api/simulacion/ejecutar`, {
            method: 'POST',
            body: JSON.stringify(configuracion)
        });
        if (!response.ok) throw new Error('Error al ejecutar la simulación');
        return await response.json();
    }

    // Métodos adicionales para GET, PUT, DELETE si los necesitas
} 