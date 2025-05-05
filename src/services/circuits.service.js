export class circuitsService{
    constructor(){
        this.API_BASE = import.meta.env.VITE_API_BASE_URL   
    }

    async getHeaders() {
        // Obtener el token de localStorage con múltiples opciones
        const token = localStorage.getItem('token') || 
                    localStorage.getItem('auth_token') || 
                    localStorage.getItem('accessToken');
                    
        if (!token) {
            console.warn('No hay token de autenticación, intentando sin token');
            return {
                'Content-Type': 'application/json'
            };
        }
        
        // Construir el header de autorización en el formato esperado
        let authHeader;
        if (token.startsWith('Bearer ')) {
            authHeader = token;
        } else {
            authHeader = `Bearer ${token}`;
        }
        
        return {
            'Content-Type': 'application/json',
            'Authorization': authHeader
        };
    }

    async getCircuitos(){
        try{
            console.log(`Datos obtenidos de: ${this.API_BASE}/api/circuitos`);
            
            const headers = await this.getHeaders();
            
            const response = await fetch(`${this.API_BASE}/api/circuitos`, {
                method: "GET",
                headers
            });

            if (!response.ok) {
                console.error(`Error al obtener los circuitos: ${response.status} ${response.statusText}`);
                return [];
            }

            const data = await response.json()
            console.log("Datos recibidos:", data);

            // Extraer los circuitos de la respuesta
            if (data && data.circuitos && Array.isArray(data.circuitos)) {
                return data.circuitos;
            }
            
            return [];
            
        }
        catch(error){
            console.error("Error en getCircuitos:", error);
            return []; // Devolver array vacío en caso de error
        }
    }
}