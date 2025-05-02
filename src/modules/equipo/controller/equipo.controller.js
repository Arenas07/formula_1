const equipoService = require('../service/equipo.service');

class EquipoController {
    async getEquipos(req, res) {
        try {
            const result = await equipoService.getEquipos();
            if (result.success) {
                console.log('✅ EquipoController - getEquipos - Todos los equipos obtenidos');
                res.json({
                    status: '200',
                    message: 'Todos los equipos obtenidos',
                    equipos: result.equipos
                });
            } else {
                console.log('❌ EquipoController - getEquipos - Error:', result.message);
                res.status(401).json({ message: result.message });
            }
        } catch (error) {
            console.error('💥 EquipoController - getEquipos - Error:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }
}

module.exports = new EquipoController();
