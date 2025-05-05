export async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
        throw new Error('Sesión expirada o no autorizada');
    }
    return response;
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