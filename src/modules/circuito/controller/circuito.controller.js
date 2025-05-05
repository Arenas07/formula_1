const circuitoService = require('../service/circuito.service');

class CircuitoController {
    async getCircuitos(req, res) {
        try {
            const result = await circuitoService.getCircuitos();
            if (result.success) {
                console.log('✅ CircuitoController - getCircuitos - Todos los circuitos obtenidos');
                res.json({
                    success: true,
                    message: 'Todos los circuitos obtenidos',
                    circuitos: result.circuitos
                });
            } else {
                console.log('❌ CircuitoController - getCircuitos - Error:', result.message);
                res.status(404).json({ 
                    success: false,
                    message: result.message 
                });
            }
        } catch (error) {
            console.error('💥 CircuitoController - getCircuitos - Error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error en el servidor',
                error: error.message
            });
        }
    }

    async getCircuitoById(req, res) {
        try {
            const { id } = req.params;
            const result = await circuitoService.getCircuitoById(Number(id));
            if (result.success) {
                console.log('✅ CircuitoController - getCircuitoById - Circuito obtenido');
                res.json({
                    success: true,
                    message: 'Circuito obtenido exitosamente',
                    circuito: result.circuito
                });
            } else {
                console.log('❌ CircuitoController - getCircuitoById - Error:', result.message);
                res.status(404).json({ 
                    success: false,
                    message: result.message 
                });
            }
        } catch (error) {
            console.error('💥 CircuitoController - getCircuitoById - Error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error en el servidor',
                error: error.message
            });
        }
    }

    async createCircuito(req, res) {
        try {
            const circuitoData = req.body;

            // Validar que el ID sea un número
            if (isNaN(circuitoData.id)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID debe ser un número'
                });
            }

            // Convertir el ID a número
            circuitoData.id = Number(circuitoData.id);

            const result = await circuitoService.createCircuito(circuitoData);
            if (result.success) {
                console.log('✅ CircuitoController - createCircuito - Circuito creado');
                res.status(201).json({
                    success: true,
                    message: 'Circuito creado exitosamente',
                    circuito: result.circuito
                });
            } else {
                console.log('❌ CircuitoController - createCircuito - Error:', result.message);
                res.status(400).json({ 
                    success: false,
                    message: result.message 
                });
            }
        } catch (error) {
            console.error('💥 CircuitoController - createCircuito - Error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error en el servidor',
                error: error.message
            });
        }
    }

    async updateCircuito(req, res) {
        try {
            const { id } = req.params;
            const circuitoData = req.body;

            // Validar que el ID sea un número
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID debe ser un número'
                });
            }

            // Convertir el ID a número
            const circuitoId = Number(id);

            // Si se proporciona un ID en el body, asegurarse de que sea un número
            if (circuitoData.id) {
                circuitoData.id = Number(circuitoData.id);
            }

            const result = await circuitoService.updateCircuito(circuitoId, circuitoData);
            if (result.success) {
                console.log('✅ CircuitoController - updateCircuito - Circuito actualizado');
                res.json({
                    success: true,
                    message: 'Circuito actualizado exitosamente',
                    circuito: result.circuito
                });
            } else {
                console.log('❌ CircuitoController - updateCircuito - Error:', result.message);
                res.status(404).json({ 
                    success: false,
                    message: result.message 
                });
            }
        } catch (error) {
            console.error('💥 CircuitoController - updateCircuito - Error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error en el servidor',
                error: error.message
            });
        }
    }

    async deleteCircuito(req, res) {
        try {
            const { id } = req.params;

            // Validar que el ID sea un número
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID debe ser un número'
                });
            }

            const result = await circuitoService.deleteCircuito(Number(id));
            if (result.success) {
                console.log('✅ CircuitoController - deleteCircuito - Circuito eliminado');
                res.json({
                    success: true,
                    message: 'Circuito eliminado exitosamente'
                });
            } else {
                console.log('❌ CircuitoController - deleteCircuito - Error:', result.message);
                res.status(404).json({ 
                    success: false,
                    message: result.message 
                });
            }
        } catch (error) {
            console.error('💥 CircuitoController - deleteCircuito - Error:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error en el servidor',
                error: error.message
            });
        }
    }
}

module.exports = new CircuitoController(); 