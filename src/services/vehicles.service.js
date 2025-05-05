import { AuthService } from './login.service';

export class VehiclesService {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
        this.authService = new AuthService();
    }

    async isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    async getHeaders() {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async getVehicles() {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseUrl}/vehiculos`, {
                headers
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener los vehículos');
            }
            return data;
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
            throw error;
        }
    }

    async getVehicleById(id) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseUrl}/vehiculos/${id}`, {
                headers
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener el vehículo');
            }
            return data;
        } catch (error) {
            console.error('Error al obtener vehículo:', error);
            throw error;
        }
    }

    async createVehicle(vehicleData) {
        try {
            const headers = await this.getHeaders();
            // Generar un ID numérico basado en timestamp
            const tempId = parseInt(Date.now().toString().slice(-6));
            
            const dataToSend = {
                id: tempId,
                ...vehicleData
            };

            console.log('Enviando datos al backend:', dataToSend);
            
            const response = await fetch(`${this.baseUrl}/vehiculos`, {
                method: 'POST',
                headers,
                body: JSON.stringify(dataToSend)
            });

            const data = await response.json();
            console.log('Respuesta del backend:', data);

            if (!response.ok) {
                console.error('Respuesta de error del backend:', data);
                throw new Error(data.message || 'Error al crear el vehículo');
            }

            return data;
        } catch (error) {
            console.error('Error al crear el vehículo:', error);
            throw error;
        }
    }

    async updateVehicle(id, vehicleData) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseUrl}/vehiculos/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(vehicleData)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al actualizar el vehículo');
            }
            return data;
        } catch (error) {
            console.error('Error al actualizar vehículo:', error);
            throw error;
        }
    }

    async deleteVehicle(id) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseUrl}/vehiculos/${id}`, {
                method: 'DELETE',
                headers
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al eliminar el vehículo');
            }
            return data;
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
            throw error;
        }
    }
}