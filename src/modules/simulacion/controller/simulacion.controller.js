const SimulacionService = require('../service/simulacion.service');
const ResponseHandler = require('../../../shared/response/ResponseHandler');

class SimulacionController {
    async getConfiguraciones(req, res) {
        try {
            const usuario_id = req.user._id;
            const result = await SimulacionService.getConfiguraciones(usuario_id);
            if (!result.success) {
                return ResponseHandler.notFound(res, result.message);
            }
            return ResponseHandler.success(res, result.configuraciones);
        } catch (error) {
            console.error('💥 SimulacionController - getConfiguraciones - Error:', error);
            return ResponseHandler.serverError(res, 'Error al obtener las configuraciones');
        }
    }

    async getConfiguracionById(req, res) {
        try {
            const { id } = req.params;
            const usuario_id = req.user._id;
            const result = await SimulacionService.getConfiguracionById(id, usuario_id);
            if (!result.success) {
                return ResponseHandler.notFound(res, result.message);
            }
            return ResponseHandler.success(res, result.configuracion);
        } catch (error) {
            console.error('💥 SimulacionController - getConfiguracionById - Error:', error);
            return ResponseHandler.serverError(res, 'Error al obtener la configuración');
        }
    }

    async createConfiguracion(req, res) {
        try {
            const usuario_id = req.user._id;
            const data = { ...req.body, usuario_id };
            const result = await SimulacionService.createConfiguracion(data);
            if (!result.success) {
                return ResponseHandler.badRequest(res, result.message);
            }
            return ResponseHandler.created(res, result.configuracion);
        } catch (error) {
            console.error('💥 SimulacionController - createConfiguracion - Error:', error);
            return ResponseHandler.serverError(res, 'Error al crear la configuración');
        }
    }

    async updateConfiguracion(req, res) {
        try {
            const { id } = req.params;
            const usuario_id = req.user._id;
            const result = await SimulacionService.updateConfiguracion(id, usuario_id, req.body);
            if (!result.success) {
                return ResponseHandler.notFound(res, result.message);
            }
            return ResponseHandler.success(res, result.configuracion);
        } catch (error) {
            console.error('💥 SimulacionController - updateConfiguracion - Error:', error);
            return ResponseHandler.serverError(res, 'Error al actualizar la configuración');
        }
    }

    async deleteConfiguracion(req, res) {
        try {
            const { id } = req.params;
            const usuario_id = req.user._id;
            const result = await SimulacionService.deleteConfiguracion(id, usuario_id);
            if (!result.success) {
                return ResponseHandler.notFound(res, result.message);
            }
            return ResponseHandler.success(res, { message: 'Configuración eliminada exitosamente' });
        } catch (error) {
            console.error('💥 SimulacionController - deleteConfiguracion - Error:', error);
            return ResponseHandler.serverError(res, 'Error al eliminar la configuración');
        }
    }

    async ejecutarSimulacion(req, res) {
        try {
            const usuario_id = req.user._id;
            const data = { ...req.body, usuario_id };
            const result = await SimulacionService.ejecutarSimulacion(data);
            if (!result.success) {
                return ResponseHandler.badRequest(res, result.message);
            }
            return ResponseHandler.success(res, result.resultados);
        } catch (error) {
            console.error('💥 SimulacionController - ejecutarSimulacion - Error:', error);
            return ResponseHandler.serverError(res, 'Error al ejecutar la simulación');
        }
    }
}

module.exports = new SimulacionController(); 