export class circuitsService{
    constructor(){
        this.API_BASE = import.meta.env.VITE_API_BASE_URL;
        this.END_POINT = `${this.API_BASE}/api/circuitos`;
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

    // Obtener todos los circuitos
    async getCircuitos(){
        try{
            console.log(`Obteniendo circuitos desde: ${this.END_POINT}`);
            
            const headers = await this.getHeaders();
            
            const response = await fetch(this.END_POINT, {
                method: "GET",
                headers
            });

            if (!response.ok) {
                console.error(`Error al obtener los circuitos: ${response.status} ${response.statusText}`);
                return [];
            }

            const data = await response.json();
            console.log("Datos recibidos:", data);

            // Extraer los circuitos de la respuesta
            if (data && data.circuitos && Array.isArray(data.circuitos)) {
                return data.circuitos;
            } else if (Array.isArray(data)) {
                return data;
            }
            
            return [];
            
        }
        catch(error){
            console.error("Error en getCircuitos:", error);
            return []; // Devolver array vacío en caso de error
        }
    }

    // Obtener un circuito específico por ID
    async getCircuitoById(id) {
        try {
            console.log(`Obteniendo circuito con ID ${id} desde: ${this.END_POINT}/${id}`);
            
            const headers = await this.getHeaders();
            
            const response = await fetch(`${this.END_POINT}/${id}`, {
                method: "GET",
                headers
            });

            if (!response.ok) {
                console.error(`Error al obtener el circuito: ${response.status} ${response.statusText}`);
                return null;
            }

            const data = await response.json();
            console.log("Datos del circuito recibidos:", data);

            // Extraer el circuito de la respuesta
            if (data && data.circuito) {
                return data.circuito;
            } else if (data && !Array.isArray(data)) {
                return data;
            }
            
            return null;
        }
        catch(error) {
            console.error(`Error al obtener el circuito con ID ${id}:`, error);
            return null;
        }
    }

    // Crear un nuevo circuito
    async createCircuito(circuitoData) {
        try {
            console.log(`Creando circuito en: ${this.END_POINT}`);
            console.log("Datos a enviar:", circuitoData);
            
            const headers = await this.getHeaders();
            
            // Si el ID no viene en los datos, generar uno temporal basado en timestamp
            if (!circuitoData.id) {
                circuitoData.id = parseInt(Date.now().toString().slice(-6));
            }
            
            // Asegurarse de que el campo vueltas esté definido (para compatibilidad con backend)
            if (!circuitoData.vueltas && circuitoData.vueltas_carrera) {
                circuitoData.vueltas = circuitoData.vueltas_carrera;
            }
            
            // Asegurarse de que el campo trazado esté definido (requerido por el backend)
            if (!circuitoData.trazado) {
                circuitoData.trazado = "circular";
            }
            
            const response = await fetch(this.END_POINT, {
                method: "POST",
                headers,
                body: JSON.stringify(circuitoData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error al crear el circuito:", errorData);
                throw new Error(errorData.message || `Error al crear el circuito: ${response.status}`);
            }

            const data = await response.json();
            console.log("Circuito creado con éxito:", data);
            
            return data.circuito || data;
        }
        catch(error) {
            console.error("Error al crear el circuito:", error);
            throw error;
        }
    }

    // Actualizar un circuito existente
    async updateCircuito(id, circuitoData) {
        try {
            console.log(`Actualizando circuito con ID ${id} en: ${this.END_POINT}/${id}`);
            console.log("Datos a actualizar:", circuitoData);
            
            const headers = await this.getHeaders();
            
            // Asegurarse de que el campo vueltas esté definido (para compatibilidad con backend)
            if (!circuitoData.vueltas && circuitoData.vueltas_carrera) {
                circuitoData.vueltas = circuitoData.vueltas_carrera;
            }
            
            // Asegurarse de que el campo trazado esté definido (requerido por el backend)
            if (!circuitoData.trazado) {
                circuitoData.trazado = "circular";
            }
            
            const response = await fetch(`${this.END_POINT}/${id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(circuitoData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error al actualizar el circuito:", errorData);
                throw new Error(errorData.message || `Error al actualizar el circuito: ${response.status}`);
            }

            const data = await response.json();
            console.log("Circuito actualizado con éxito:", data);
            
            return data.circuito || data;
        }
        catch(error) {
            console.error(`Error al actualizar el circuito con ID ${id}:`, error);
            throw error;
        }
    }

    // Eliminar un circuito
    async deleteCircuito(id) {
        try {
            console.log(`Eliminando circuito con ID ${id} en: ${this.END_POINT}/${id}`);
            
            const headers = await this.getHeaders();
            
            const response = await fetch(`${this.END_POINT}/${id}`, {
                method: "DELETE",
                headers
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error al eliminar el circuito:", errorData);
                throw new Error(errorData.message || `Error al eliminar el circuito: ${response.status}`);
            }

            const data = await response.json();
            console.log("Circuito eliminado con éxito:", data);
            
            return data;
        }
        catch(error) {
            console.error(`Error al eliminar el circuito con ID ${id}:`, error);
            throw error;
        }
    }
}