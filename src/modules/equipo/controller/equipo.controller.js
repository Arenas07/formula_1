const EquipoService = require('../service/equipo.service');

class EquipoController {
    async getEquipos(req, res) {
        try {
            const resultado = await EquipoService.getEquipos();
            if (!resultado.success) {
                return res.status(404).json(resultado);
            }
            return res.status(200).json(resultado);
        } catch (error) {
            console.error('💥 EquipoController - getEquipos - Error:', error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    async getEquipoById(req, res) {
        try {
            const { id } = req.params;
            const resultado = await EquipoService.getEquipoById(id);
            if (!resultado.success) {
                return res.status(404).json(resultado);
            }
            return res.status(200).json(resultado);
        } catch (error) {
            console.error('💥 EquipoController - getEquipoById - Error:', error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    async createEquipo(req, res) {
        try {
            const equipoData = req.body;
            const resultado = await EquipoService.createEquipo(equipoData);
            if (!resultado.success) {
                return res.status(400).json(resultado);
            }
            return res.status(201).json(resultado);
        } catch (error) {
            console.error('💥 EquipoController - createEquipo - Error:', error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    async updateEquipo(req, res) {
        try {
            const { id } = req.params;
            const equipoData = req.body;
            const resultado = await EquipoService.updateEquipo(id, equipoData);
            if (!resultado.success) {
                return res.status(404).json(resultado);
            }
            return res.status(200).json(resultado);
        } catch (error) {
            console.error('💥 EquipoController - updateEquipo - Error:', error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    async deleteEquipo(req, res) {
        try {
            const { id } = req.params;
            const resultado = await EquipoService.deleteEquipo(id);
            if (!resultado.success) {
                return res.status(404).json(resultado);
            }
            return res.status(200).json(resultado);
        } catch (error) {
            console.error('💥 EquipoController - deleteEquipo - Error:', error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }
}

module.exports = new EquipoController();
