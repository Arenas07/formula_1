// piloto.service.js
import { AuthService } from './login.service';

export class PilotoService {
    constructor() {
        this.API_BASE = import.meta.env.VITE_API_BASE_URL;
        this.authService = new AuthService();
    }
    
    // Método para verificar si hay un token válido
    isAuthenticated() {
        return this.authService.isAdmin() || this.authService.hasPermission('puedeGestionarPilotos');
    }

    // Método para obtener los headers con el token
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }
    
    async getPilotos() {
        try {
            const response = await fetch(`${this.API_BASE}/api/pilotos`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            if (!response.ok) {
                throw new Error('Error al obtener los pilotos');
            }
            
            const data = await response.json();
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
                headers: this.getHeaders()
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
        try {
            if (!this.isAuthenticated()) {
                throw new Error('No tienes permisos para crear pilotos');
            }

            console.log('Datos recibidos en el servicio:', pilotoData);

            // Validar y convertir el número del piloto
            const driverNumber = Number(pilotoData.driver_number);
            console.log('Número de piloto en el servicio:', driverNumber);

            if (isNaN(driverNumber)) {
                throw new Error('El número del piloto debe ser un número válido');
            }

            // Mapeo de campos y valores según el backend
            const body = {
                first_name: pilotoData.first_name,
                last_name: pilotoData.last_name,
                country_code: pilotoData.country_code?.toUpperCase(),
                driver_number: driverNumber,
                headshot_url: pilotoData.headshot_url,
                team_colour: pilotoData.team_colour || pilotoData.team_color,
                team_name: pilotoData.team_name,
                rol: pilotoData.rol,
                tipo_conduccion: pilotoData.tipo_conduccion,
                estrategia: pilotoData.estrategia,
                biografia: pilotoData.biografia || ''
            };
            if (pilotoData.estadisticas) {
                body.estadisticas = pilotoData.estadisticas;
            }

            console.log('Enviando body a backend:', body);
            const response = await fetch(`${this.API_BASE}/api/pilotos/nuevo`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                let errorMsg = 'Error al crear el piloto';
                try {
                    const errorData = await response.json();
                    console.error('Respuesta de error del backend:', errorData);
                    if (errorData.errors && Array.isArray(errorData.errors)) {
                        // Formatear los errores específicos
                        errorMsg = errorData.errors.map(err => {
                            if (typeof err === 'string') return err;
                            if (err.campo && err.mensaje) return `${err.campo}: ${err.mensaje}`;
                            return JSON.stringify(err);
                        }).join('\n');
                    } else if (errorData.message) {
                        errorMsg = errorData.message;
                    }
                } catch (e) {
                    console.error('Error al procesar la respuesta de error:', e);
                }
                throw new Error(errorMsg);    
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al crear el piloto:', error);
            throw error;
        }
    }

    async updatePiloto(id, pilotoData) {
        try {
            if (!this.isAuthenticated()) {
                throw new Error('No tienes permisos para actualizar pilotos');
            }

            // Preparar el body según la documentación
            const body = {
                // Campos básicos
                first_name: pilotoData.first_name,
                last_name: pilotoData.last_name,
                country_code: pilotoData.country_code?.toUpperCase(),
                driver_number: Number(pilotoData.driver_number),
                headshot_url: pilotoData.headshot_url,
                team_colour: pilotoData.team_colour || pilotoData.team_color,
                team_name: pilotoData.team_name,
                biografia: pilotoData.biografia,

                // Campos de rol y estrategia
                rol: pilotoData.rol,
                tipo_conduccion: pilotoData.tipo_conduccion,
                estrategia: pilotoData.estrategia
            };

            // Agregar estadísticas si existen
            if (pilotoData.estadisticas) {
                body.estadisticas = {
                    victorias: Number(pilotoData.estadisticas.victorias),
                    podios: Number(pilotoData.estadisticas.podios),
                    poles: Number(pilotoData.estadisticas.poles),
                    mejor_tiempo: pilotoData.estadisticas.mejor_tiempo,
                    campeonatos_mundiales: Number(pilotoData.estadisticas.campeonatos_mundiales),
                    puntos_f1: Number(pilotoData.estadisticas.puntos_f1)
                };
            }

            console.log('Enviando actualización al backend:', body);

            const response = await fetch(`${this.API_BASE}/api/pilotos/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                let errorMsg = 'Error al actualizar el piloto';
                try {
                    const errorData = await response.json();
                    console.error('Respuesta de error del backend:', errorData);
                    if (errorData.errors) {
                        // Formatear mensajes de error específicos
                        errorMsg = errorData.errors.map(err => `${err.campo}: ${err.mensaje}`).join('\n');
                    } else if (errorData.message) {
                        errorMsg = errorData.message;
                    }
                } catch {}
                throw new Error(errorMsg);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al actualizar el piloto:', error);
            throw error;
        }
    }

    async eliminarPiloto(id) {
        try {
            if (!this.isAuthenticated()) {
                throw new Error('No tienes permisos para eliminar pilotos');
            }

            if (!id) {
                throw new Error('ID del piloto no proporcionado');
            }

            console.log('Intentando eliminar piloto con ID:', id);

            const response = await fetch(`${this.API_BASE}/api/pilotos/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                let errorMsg = 'Error al eliminar el piloto';
                try {
                    const errorData = await response.json();
                    console.error('Respuesta de error del backend:', errorData);
                    
                    if (errorData.errors && Array.isArray(errorData.errors)) {
                        errorMsg = errorData.errors.map(err => {
                            if (typeof err === 'string') return err;
                            if (err.campo && err.mensaje) return `${err.campo}: ${err.mensaje}`;
                            return JSON.stringify(err);
                        }).join('\n');
                    } else if (errorData.message) {
                        errorMsg = errorData.message;
                    } else if (errorData.error) {
                        errorMsg = errorData.error;
                    }
                } catch (e) {
                    console.error('Error al procesar la respuesta de error:', e);
                    errorMsg = `Error del servidor (${response.status}): ${response.statusText}`;
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            console.log('Piloto eliminado exitosamente:', data);
            return data;
        } catch (error) {
            console.error('Error al eliminar el piloto:', error);
            throw error;
        }
    }
}