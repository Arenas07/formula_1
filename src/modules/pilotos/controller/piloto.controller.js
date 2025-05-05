const pilotoService = require('../service/piloto.service');
const ResponseHandler = require('../../../shared/response/ResponseHandler');

class PilotoController {
    async getPilotos(req, res) {
        try {
            const result = await pilotoService.getPilotos();
            if (result.success) {
                return ResponseHandler.success(res, result.pilotos, 'Pilotos obtenidos exitosamente');
            } else {
                return ResponseHandler.notFound(res, result.message);
            }
        } catch (error) {
            console.error('💥 PilotoController - getPilotos - Error:', error);
            return ResponseHandler.serverError(res, 'Error al obtener los pilotos', error);
        }
    }

    async getPilotoById(req, res) {
        try {
            const { id } = req.params;
            const result = await pilotoService.getPilotoById(id);
            
            if (result.success) {
                return ResponseHandler.success(res, result.piloto, 'Piloto encontrado');
            } else {
                return ResponseHandler.notFound(res, result.message);
            }
        } catch (error) {
            console.error('💥 PilotoController - getPilotoById - Error:', error);
            return ResponseHandler.serverError(res, 'Error al obtener el piloto', error);
        }
    }

    async createPiloto(req, res) {
        try {
            const result = await pilotoService.createPiloto(req.body);
            if (result.success) {
                return ResponseHandler.created(res, result.piloto, 'Piloto creado exitosamente');
            } else {
                return ResponseHandler.badRequest(res, result.message);
            }
        } catch (error) {
            console.error('💥 PilotoController - createPiloto - Error:', error);
            return ResponseHandler.serverError(res, 'Error al crear el piloto', error);
        }
    }

    async updatePiloto(req, res) {
        try {
            const { id } = req.params;
            const result = await pilotoService.updatePiloto(id, req.body);
            
            if (result.success) {
                return ResponseHandler.success(res, result.piloto, 'Piloto actualizado exitosamente');
            } else {
                return ResponseHandler.notFound(res, result.message);
            }
        } catch (error) {
            console.error('💥 PilotoController - updatePiloto - Error:', error);
            return ResponseHandler.serverError(res, 'Error al actualizar el piloto', error);
        }
    }

    async deletePiloto(req, res) {
        try {
            const { id } = req.params;
            const result = await pilotoService.deletePiloto(id);
            
            if (result.success) {
                return ResponseHandler.success(res, null, 'Piloto eliminado exitosamente');
            } else {
                return ResponseHandler.notFound(res, result.message);
            }
        } catch (error) {
            console.error('💥 PilotoController - deletePiloto - Error:', error);
            return ResponseHandler.serverError(res, 'Error al eliminar el piloto', error);
        }
    }

    /**
     * Crear piloto nuevo (estadísticas en 0)
     */
    async createPilotoNuevo(req, res) {
        try {
            const result = await pilotoService.createPilotoNuevo(req.body);
            if (result.success) {
                return ResponseHandler.created(res, result.piloto, 'Piloto nuevo creado exitosamente');
            } else {
                return ResponseHandler.badRequest(res, result.message);
            }
        } catch (error) {
            console.error('💥 PilotoController - createPilotoNuevo - Error:', error);
            return ResponseHandler.serverError(res, 'Error al crear el piloto nuevo', error);
        }
    }

    /**
     * Crear piloto que ya compite (estadísticas desde el request)
     */
    async createPilotoCompetidor(req, res) {
        try {
            const result = await pilotoService.createPilotoCompetidor(req.body);
            if (result.success) {
                return ResponseHandler.created(res, result.piloto, 'Piloto competidor creado exitosamente');
            } else {
                return ResponseHandler.badRequest(res, result.message);
            }
        } catch (error) {
            console.error('💥 PilotoController - createPilotoCompetidor - Error:', error);
            return ResponseHandler.serverError(res, 'Error al crear el piloto competidor', error);
        }
    }
}

// Exportar una instancia del controlador
const pilotoController = new PilotoController();
module.exports = pilotoController;

