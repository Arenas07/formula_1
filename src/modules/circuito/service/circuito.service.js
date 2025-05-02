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
}

module.exports = new CircuitoService(); 