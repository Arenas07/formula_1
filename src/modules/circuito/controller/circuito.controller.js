const circuitoService = require('../service/circuito.service');

class CircuitoController {
    async getCircuitos(req, res) {
        try {
            const result = await circuitoService.getCircuitos();
            if (result.success) {
                console.log('✅ CircuitoController - getCircuitos - Todos los circuitos obtenidos');
                res.json({
                    status: '200',
                    message: 'Todos los circuitos obtenidos',
                    circuitos: result.circuitos
                });
            } else {
                console.log('❌ CircuitoController - getCircuitos - Error:', result.message);
                res.status(401).json({ message: result.message });
            }
        } catch (error) {
            console.error('💥 CircuitoController - getCircuitos - Error:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }
}

module.exports = new CircuitoController(); 