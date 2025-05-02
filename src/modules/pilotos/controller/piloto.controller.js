const pilotoService = require('../service/piloto.service');

class PilotoController {
    async getPilotos(req, res) {
        try {
            const result = await pilotoService.getPilotos();
            if (result.success) {
                console.log('✅ PilotoController - getPilotos - Todos los pilotos obtenidos');
                res.json({
                    status: '200',
                    message: 'Todos los pilotos obtenidos',
                    pilotos: result.pilotos
                });
            } else {
                console.log('❌ PilotoController - getPilotos - Error:', result.message);
                res.status(401).json({ message: result.message });
            }
        } catch (error) {
            console.error('💥 PilotoController - getPilotos - Error:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    async getPilotoById(req, res) {
        try {
            const { id } = req.params;
            const result = await pilotoService.getPilotoById(id);
            if (result.success) {
                res.json({ status: '200', message: 'Piloto encontrado', piloto: result.piloto });
            } else {
                res.status(404).json({ message: result.message });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    async createPiloto(req, res) {
        try {
            const result = await pilotoService.createPiloto(req.body);
            if (result.success) {
                res.status(201).json({ status: '201', message: 'Piloto creado', piloto: result.piloto });
            } else {
                res.status(400).json({ message: result.message });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    async updatePiloto(req, res) {
        try {
            const { id } = req.params;
            const result = await pilotoService.updatePiloto(id, req.body);
            if (result.success) {
                res.json({ status: '200', message: 'Piloto actualizado', piloto: result.piloto });
            } else {
                res.status(404).json({ message: result.message });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    async deletePiloto(req, res) {
        try {
            const { id } = req.params;
            const result = await pilotoService.deletePiloto(id);
            if (result.success) {
                res.json({ status: '200', message: 'Piloto eliminado' });
            } else {
                res.status(404).json({ message: result.message });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    /**
     * Crear piloto nuevo (estadísticas en 0)
     */
    async createPilotoNuevo(req, res) {
        try {
            const result = await pilotoService.createPilotoNuevo(req.body);
            if (result.success) {
                res.status(201).json({ status: '201', message: 'Piloto nuevo creado', piloto: result.piloto });
            } else {
                res.status(400).json({ message: result.message });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    /**
     * Crear piloto que ya compite (estadísticas desde el request)
     */
    async createPilotoCompetidor(req, res) {
        try {
            const result = await pilotoService.createPilotoCompetidor(req.body);
            if (result.success) {
                res.status(201).json({ status: '201', message: 'Piloto competidor creado', piloto: result.piloto });
            } else {
                res.status(400).json({ message: result.message });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }
}

module.exports = PilotoController;

