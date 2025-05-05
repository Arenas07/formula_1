const CircuitoRepository = require('../infraestructure/repository/circuito.repository');

class CircuitoService {
    async getCircuitos() {
        try {
            const circuitos = await CircuitoRepository.getCircuitos();
            if (circuitos.length === 0) {
                console.log('❌ CircuitoService - getCircuitos - No hay circuitos disponibles');
                return { success: false, message: 'No hay circuitos disponibles' };
            }
            console.log('✅ CircuitoService - getCircuitos - Todos los circuitos obtenidos');
            return { success: true, circuitos };
        } catch (error) {
            console.error('💥 CircuitoService - getCircuitos - Error:', error);
            throw error;
        }
    }

    async getCircuitoById(id) {
        try {
            const circuito = await CircuitoRepository.getCircuitoById(id);
            if (!circuito) {
                console.log('❌ CircuitoService - getCircuitoById - Circuito no encontrado');
                return { success: false, message: 'Circuito no encontrado' };
            }
            console.log('✅ CircuitoService - getCircuitoById - Circuito obtenido');
            return { success: true, circuito };
        } catch (error) {
            console.error('💥 CircuitoService - getCircuitoById - Error:', error);
            throw error;
        }
    }

    async createCircuito(circuitoData) {
        try {
            // Validar campos básicos requeridos
            const requiredFields = [
                'id', 'nombre', 'pais', 'ciudad', 'continente', 'longitud_km',
                'vueltas', 'descripcion', 'imagen', 'trazado', 'vueltas_carrera',
                'distancia_carrera', 'primer_gp'
            ];
            
            for (const field of requiredFields) {
                if (!circuitoData[field]) {
                    return { 
                        success: false, 
                        message: `El campo ${field} es requerido` 
                    };
                }
            }

            // Validar que el ID sea único
            const existingCircuito = await CircuitoRepository.getCircuitoById(circuitoData.id);
            if (existingCircuito) {
                console.log('❌ CircuitoService - createCircuito - Ya existe un circuito con ese ID');
                return { success: false, message: 'Ya existe un circuito con ese ID' };
            }

            const circuito = await CircuitoRepository.createCircuito(circuitoData);
            console.log('✅ CircuitoService - createCircuito - Circuito creado');
            return { success: true, circuito };
        } catch (error) {
            console.error('💥 CircuitoService - createCircuito - Error:', error);
            if (error.code === 11000) {
                return { success: false, message: 'Ya existe un circuito con ese nombre' };
            }
            throw error;
        }
    }

    async updateCircuito(id, circuitoData) {
        try {
            const circuitoExistente = await CircuitoRepository.getCircuitoById(id);
            if (!circuitoExistente) {
                console.log('❌ CircuitoService - updateCircuito - Circuito no encontrado');
                return { success: false, message: 'Circuito no encontrado' };
            }

            const circuito = await CircuitoRepository.updateCircuito(id, circuitoData);
            console.log('✅ CircuitoService - updateCircuito - Circuito actualizado');
            return { success: true, circuito };
        } catch (error) {
            console.error('💥 CircuitoService - updateCircuito - Error:', error);
            throw error;
        }
    }

    async deleteCircuito(id) {
        try {
            const circuitoExistente = await CircuitoRepository.getCircuitoById(id);
            if (!circuitoExistente) {
                console.log('❌ CircuitoService - deleteCircuito - Circuito no encontrado');
                return { success: false, message: 'Circuito no encontrado' };
            }

            await CircuitoRepository.deleteCircuito(id);
            console.log('✅ CircuitoService - deleteCircuito - Circuito eliminado');
            return { success: true };
        } catch (error) {
            console.error('💥 CircuitoService - deleteCircuito - Error:', error);
            throw error;
        }
    }
}

module.exports = new CircuitoService(); 