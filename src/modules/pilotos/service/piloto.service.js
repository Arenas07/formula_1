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

    async createPilotoNuevo(data) {
        try {
            // Generar campos automáticos y estadísticas en 0
            const pilotoData = this._generarDatosPiloto(data, true);
            const piloto = await PilotoRepository.createPiloto(pilotoData);
            return { success: true, piloto };
        } catch (error) {
            return { success: false, message: 'Error al crear piloto nuevo' };
        }
    }

    async createPilotoCompetidor(data) {
        try {
            // Generar campos automáticos y estadísticas desde el request
            const pilotoData = this._generarDatosPiloto(data, false);
            const piloto = await PilotoRepository.createPiloto(pilotoData);
            return { success: true, piloto };
        } catch (error) {
            return { success: false, message: 'Error al crear piloto competidor' };
        }
    }

    // Método privado para generar los datos del piloto
    _generarDatosPiloto(data, esNuevo) {
        // id autoincremental o random
        const id = Math.floor(Math.random() * 1000000);
        // broadcast_name: primer nombre + apellido
        const broadcast_name = `${data.first_name} ${data.last_name}`;
        // country_code: se asume que viene del front como código
        // driver_number: lo ingresa el usuario
        // full_name: primer nombre + apellido
        const full_name = `${data.first_name} ${data.last_name}`;
        // headshot_url: lo ingresa el usuario
        // meeting_key: random
        const meeting_key = Math.floor(Math.random() * 1000000);
        // name_acronym: primeras 3 letras del apellido
        const name_acronym = data.last_name ? data.last_name.substring(0, 3).toUpperCase() : '';
        // session_key: random
        const session_key = Math.floor(Math.random() * 1000000);
        // team_colour, team_name, biografia, rol, tipo_conduccion, estrategia: los ingresa el usuario
        // estadisticas
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
            biografia: data.biografia,
            rol: data.rol,
            tipo_conduccion: data.tipo_conduccion,
            estrategia: data.estrategia
        };
    }
}

module.exports = new PilotoService();
