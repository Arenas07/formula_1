// piloto.service.js
export class PilotoService {
    constructor() {
        this.API_BASE = import.meta.env.VITE_API_BASE_URL;
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

    async getPilotoById(id) {
        try {
            const response = await fetch(`${this.API_BASE}/api/pilotos/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener el piloto');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener el piloto:', error);
            throw error;
        }
    }
    
}