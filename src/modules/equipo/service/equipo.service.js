const EquipoRepository = require('../infraestructure/repository/equipo.repository');

class EquipoService {
    async getEquipos() {
        try {
            const equipos = await EquipoRepository.getEquipos();
            return { success: true, equipos };
        } catch (error) {
            console.error('💥 EquipoService - getEquipos - Error:', error);
            throw error;
        }
    }

    async getEquipoById(id) {
        try {
            const equipo = await EquipoRepository.getEquipoById(id);
            if (!equipo) {
                return { success: false, message: 'Equipo no encontrado' };
            }
            return { success: true, equipo };
        } catch (error) {
            console.error('💥 EquipoService - getEquipoById - Error:', error);
            throw error;
        }
    }

    async createEquipo(equipoData) {
        try {
            // Validar campos requeridos
            const camposRequeridos = ['id', 'nombre', 'pais', 'motor', 'imagen', 'fecha_fundacion', 'sede', 'descripcion', 'director', 'presupuesto'];
            const camposFaltantes = camposRequeridos.filter(campo => !equipoData[campo]);

            if (camposFaltantes.length > 0) {
                return { 
                    success: false, 
                    message: `Faltan campos requeridos: ${camposFaltantes.join(', ')}` 
                };
            }

            const equipo = await EquipoRepository.createEquipo(equipoData);
            return { success: true, equipo };
        } catch (error) {
            console.error('💥 EquipoService - createEquipo - Error:', error);
            throw error;
        }
    }

    async updateEquipo(id, equipoData) {
        try {
            const equipo = await EquipoRepository.updateEquipo(id, equipoData);
            if (!equipo) {
                return { success: false, message: 'Equipo no encontrado' };
            }
            return { success: true, equipo };
        } catch (error) {
            console.error('💥 EquipoService - updateEquipo - Error:', error);
            throw error;
        }
    }

    async deleteEquipo(id) {
        try {
            const resultado = await EquipoRepository.deleteEquipo(id);
            if (!resultado) {
                return { success: false, message: 'Equipo no encontrado' };
            }
            return { success: true };
        } catch (error) {
            console.error('💥 EquipoService - deleteEquipo - Error:', error);
            throw error;
        }
    }
}

module.exports = new EquipoService();
