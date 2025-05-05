const PilotoRepository = require('../infraestructure/repository/piloto.repository');

class PilotoService {
    async getPilotos() {
        try {
            const pilotos = await PilotoRepository.getPilotos();
            if (pilotos.length === 0) {
                console.log('❌ PilotoService - getPilotos - No hay pilotos disponibles');
                return { success: false, message: 'No hay pilotos disponibles' };
            }
            console.log('✅ PilotoService - getPilotos - Todos los pilotos obtenidos');
            return { success: true, pilotos };
        } catch (error) {
            console.error('💥 PilotoService - getPilotos - Error:', error);
            throw error;
        }
    }

    async getPilotoById(id) {
        try {
            const piloto = await PilotoRepository.getPilotoById(id);
            
            if (!piloto) {
                console.log('❌ PilotoService - getPilotoById - Piloto no encontrado');
                return { 
                    success: false, 
                    message: 'Piloto no encontrado' 
                };
            }

            console.log('✅ PilotoService - getPilotoById - Piloto encontrado');
            return { 
                success: true, 
                piloto 
            };
        } catch (error) {
            console.error('💥 PilotoService - getPilotoById - Error:', error);
            return { 
                success: false, 
                message: 'Error al obtener el piloto' 
            };
        }
    }

    async createPiloto(data) {
        try {
            // Normalizar el rol (aceptar "Lider" sin acento)
            if (data.rol === 'Lider') {
                data.rol = 'Líder';
            }

            // Generar campos automáticos
            const pilotoData = this._generarDatosPiloto(data, true);
            const piloto = await PilotoRepository.createPiloto(pilotoData);
            return { success: true, piloto };
        } catch (error) {
            console.error('Error al crear piloto:', error);
            return { 
                success: false, 
                message: error.message || 'Error al crear piloto' 
            };
        }
    }

    async updatePiloto(id, data) {
        try {
            // Verificar si el piloto existe
            const pilotoExistente = await PilotoRepository.getPilotoById(id);
            if (!pilotoExistente) {
                return { 
                    success: false, 
                    message: 'Piloto no encontrado' 
                };
            }

            // Normalizar el rol si se proporciona
            if (data.rol && data.rol === 'Lider') {
                data.rol = 'Líder';
            }

            // Actualizar campos automáticos si se modifican nombres
            if (data.first_name || data.last_name) {
                const first_name = data.first_name || pilotoExistente.first_name;
                const last_name = data.last_name || pilotoExistente.last_name;
                data.broadcast_name = `${first_name} ${last_name}`;
                data.full_name = `${first_name} ${last_name}`;
                data.name_acronym = last_name.substring(0, 3).toUpperCase();
            }

            // Actualizar el piloto
            const pilotoActualizado = await PilotoRepository.updatePiloto(id, data);
            return { 
                success: true, 
                piloto: pilotoActualizado 
            };
        } catch (error) {
            console.error('💥 PilotoService - updatePiloto - Error:', error);
            return { 
                success: false, 
                message: 'Error al actualizar el piloto' 
            };
        }
    }

    async deletePiloto(id) {
        try {
            // Verificar si el piloto existe
            const pilotoExistente = await PilotoRepository.getPilotoById(id);
            if (!pilotoExistente) {
                return { 
                    success: false, 
                    message: 'Piloto no encontrado' 
                };
            }

            // Eliminar el piloto
            await PilotoRepository.deletePiloto(id);
            return { 
                success: true, 
                message: 'Piloto eliminado exitosamente' 
            };
        } catch (error) {
            console.error('💥 PilotoService - deletePiloto - Error:', error);
            return { 
                success: false, 
                message: 'Error al eliminar el piloto' 
            };
        }
    }

    async createPilotoNuevo(data) {
        try {
            // Normalizar el rol (aceptar "Lider" sin acento)
            if (data.rol === 'Lider') {
                data.rol = 'Líder';
            }

            // Generar campos automáticos y estadísticas en 0
            const pilotoData = this._generarDatosPiloto(data, true);
            const piloto = await PilotoRepository.createPiloto(pilotoData);
            return { success: true, piloto };
        } catch (error) {
            console.error('Error al crear piloto nuevo:', error);
            return { 
                success: false, 
                message: error.message || 'Error al crear piloto nuevo' 
            };
        }
    }

    async createPilotoCompetidor(data) {
        try {
            // Normalizar el rol (aceptar "Lider" sin acento)
            if (data.rol === 'Lider') {
                data.rol = 'Líder';
            }

            // Generar campos automáticos y estadísticas desde el request
            const pilotoData = this._generarDatosPiloto(data, false);
            const piloto = await PilotoRepository.createPiloto(pilotoData);
            return { success: true, piloto };
        } catch (error) {
            console.error('Error al crear piloto competidor:', error);
            return { 
                success: false, 
                message: error.message || 'Error al crear piloto competidor' 
            };
        }
    }

    // Método privado para generar los datos del piloto
    _generarDatosPiloto(data, esNuevo) {
        // id autoincremental o random
        const id = Math.floor(Math.random() * 1000000);
        // broadcast_name: primer nombre + apellido
        const broadcast_name = `${data.first_name} ${data.last_name}`;
        // full_name: primer nombre + apellido
        const full_name = `${data.first_name} ${data.last_name}`;
        // meeting_key: random
        const meeting_key = Math.floor(Math.random() * 1000000);
        // name_acronym: primeras 3 letras del apellido
        const name_acronym = data.last_name ? data.last_name.substring(0, 3).toUpperCase() : '';
        // session_key: random
        const session_key = Math.floor(Math.random() * 1000000);

        // estadisticas siempre inician en 0 para pilotos nuevos
        const estadisticas = esNuevo ? {
            victorias: 0,
            podios: 0,
            poles: 0,
            mejor_tiempo: '',
            campeonatos_mundiales: 0,
            puntos_f1: 0
        } : data.estadisticas;

        return {
            id,
            broadcast_name,
            country_code: data.country_code,
            driver_number: data.driver_number,
            first_name: data.first_name,
            full_name,
            headshot_url: data.headshot_url,
            last_name: data.last_name,
            meeting_key,
            name_acronym,
            session_key,
            team_colour: data.team_colour,
            team_name: data.team_name,
            estadisticas,
            biografia: data.biografia || '',
            rol: data.rol,
            tipo_conduccion: data.tipo_conduccion,
            estrategia: data.estrategia
        };
    }
}

// Exportar una instancia del servicio
const pilotoService = new PilotoService();
module.exports = pilotoService;
