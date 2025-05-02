const EquipoRepository = require('../infraestructure/repository/equipo.repository');

class EquipoService {
    async getEquipos() {
        try {
            const equipos = await EquipoRepository.getEquipos();
            if (equipos.length === 0) {
                console.log('❌ EquipoService - getEquipos - No hay equipos disponibles');
                return { success: false, message: 'No hay equipos disponibles' };
            }
            console.log('✅ EquipoService - getEquipos - Todos los equipos obtenidos');
            return { success: true, equipos };
        } catch (error) {
            console.error('💥 EquipoService - getEquipos - Error:', error);
            throw error;
        }
    }
}

module.exports = new EquipoService();
