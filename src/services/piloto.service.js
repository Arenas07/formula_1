// piloto.service.js
export class PilotoService {
    constructor() {
        this.API_BASE = import.meta.env.VITE_API_BASE_URL;
    }
    
    async getPilotoData() {
        try {
            const response = await fetch(`${this.API_BASE}/api/pilotos/1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los datos del piloto');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener datos del piloto:', error);
            throw error;
        }
    }
    
    async getPilotos() {
        try {
            const response = await fetch(`${this.API_BASE}/api/pilotos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los pilotos');
            }
            
            const data = await response.json();
            // Asegurarse de que se devuelve un array
            return Array.isArray(data) ? data : (data.pilotos || data.data || []);
        } catch (error) {
            console.error('Error al obtener pilotos:', error);
            throw error;
        }
    }
}