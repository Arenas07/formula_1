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
    

    async createPilotoNuevo(pilotoData) {
        // Mapeo de campos y valores según el backend
        const mapTipoConduccion = {
            'Normal': 'normal',
            'Agresivo': 'agresiva',
            'Ahorro de combustible': 'ahorro_combustible'
        };
        const mapEstrategia = {
            'Normal': 'balanceada',
            'Agresivo': 'agresiva',
            'Ahorro': 'ahorro'
        };
        const body = {
            first_name: pilotoData.first_name,
            last_name: pilotoData.last_name,
            country_code: pilotoData.country_code,
            driver_number: Number(pilotoData.diver_number),
            headshot_url: pilotoData.headshot_url,
            team_colour: pilotoData.team_color, // OJO: el input es team_color, el backend espera team_colour
            team_name: pilotoData.team_name,
            rol: pilotoData.rol,
            tipo_conduccion: mapTipoConduccion[pilotoData.tipo_conduccion] || '',
            estrategia: mapEstrategia[pilotoData.estrategia] || '',
            biografia: pilotoData.biografia || ''
        };
        console.log('Enviando body a backend:', body);
        try {
            const response = await fetch(`${this.API_BASE}/api/pilotos/nuevo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                let errorMsg = 'Error al crear el piloto';
                try {
                    const errorData = await response.json();
                    console.error('Respuesta de error del backend:', errorData);
                    if (errorData && errorData.message) errorMsg = errorData.message;
                } catch {}
                throw new Error(errorMsg);    
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al crear el piloto:', error);
            throw error;
        }
    }
}