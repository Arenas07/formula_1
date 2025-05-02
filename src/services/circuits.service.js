export class circuitsService{
    constructor(){
        this.API_BASE = import.meta.env.VITE_API_BASE_URL   
    }

    async getCircuitos(){
        try{
            console.log(`Datos obtenidos de: ${this.API_BASE}/api/circuitos`);
            
            const config = {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            }
            const response = await fetch(`${this.API_BASE}/api/circuitos`, config)

            if (!response.ok) {
                throw new Error(`Error al obtener los circuitos: ${response.status} ${response.statusText}`);
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
            throw error;
        }
    }
}