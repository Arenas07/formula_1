export const EquipoService = {
    async getEquipos() {
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
            if (!apiBaseUrl) {
                console.warn('VITE_API_BASE_URL no está definida. Usando URL por defecto.');
            }
            
            const url = `${apiBaseUrl || ''}/api/equipos`;
            console.log('Intentando obtener equipos desde:', url);
            
            const token = localStorage.getItem('auth_token');
            if (!token) {
                console.warn('No se encontró token de autenticación');
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error en la respuesta:', response.status, errorText);
                throw new Error(`Error al obtener los equipos: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Datos recibidos de la API:', data);
            
            if (data && data.equipos && Array.isArray(data.equipos)) {
                return data.equipos;
            } else if (Array.isArray(data)) {
                return data;
            } else if (data && typeof data === 'object') {
                if (Array.isArray(data.data)) {
                    return data.data;
                } else if (data.results && Array.isArray(data.results)) {
                    return data.results;
                }
            }
            
            console.warn('No se pudo encontrar un array de equipos en la respuesta:', data);
            return [];
        } catch (error) {
            console.error('Error al obtener equipos:', error);
            throw error;
        }
    }
};