export class VehiclesService {
    constructor() {
        this.API_BASE = import.meta.env.VITE_API_BASE_URL;
    }
    
    async getVehicles() {
        try {
            console.log('Obteniendo vehículos desde:', `${this.API_BASE}/api/vehiculos`);
            
            const response = await fetch(`${this.API_BASE}/api/vehiculos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error al obtener los vehículos: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Datos obtenidos del servidor:', data);
            
            // Buscar en múltiples estructuras posibles
            if (data && data.vehiculos && Array.isArray(data.vehiculos)) {
                return data.vehiculos;
            } else if (data && data.vehicles && Array.isArray(data.vehicles)) {
                return data.vehicles;
            } else if (data && Array.isArray(data.data)) {
                return data.data;
            } else if (Array.isArray(data)) {
                return data;
            } else if (data && data.status === "200" && data.message) {
                // En caso de que sea un formato similar al que vimos en equipos
                return data.data || [];
            }
            
            console.warn('Estructura desconocida en la respuesta:', data);
            return [];
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
            throw error;
        }
    }   
}