export class circuitsService{
    constructor(){
        this.API_BASE = import.meta.env.VITE_API_BASE_URL   
    }

    async getCircuitos(){
        try{
            console.log(`Datos obtenidos de: ${this.API_BASE}/api/xxxxxxxxxxx`);
            
            const config = {
                method: "GET",
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
            const response = await fetch(`${this.API_BASE}/api/xxxxxxxxxxxxxxx`, config)

            if (!response.ok) {
                throw new Error(`Error al obtener los vehículos: ${response.status} ${response.statusText}`);
            }

            const data = await response.json()
            console.log("Datos: " + data);

            return data
            
        }
        catch(error){
            console.log(error);
            
        }
    }
}