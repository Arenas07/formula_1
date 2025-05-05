const VehiculoService = require('../service/vehiculo.service');

class VehiculoController {
    async getVehiculos(req, res) {
        try {
            const result = await VehiculoService.getVehiculos();
            if (!result.success) {
                return res.status(404).json(result);
            }
            res.json(result);
        } catch (error) {
            console.error('💥 VehiculoController - getVehiculos - Error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener los vehículos',
                error: error.message 
            });
        }
    }

    async getVehiculoById(req, res) {
        try {
            const { id } = req.params;
            const result = await VehiculoService.getVehiculoById(Number(id));
            if (!result.success) {
                return res.status(404).json(result);
            }
            res.json(result);
        } catch (error) {
            console.error('💥 VehiculoController - getVehiculoById - Error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener el vehículo',
                error: error.message 
            });
        }
    }

    async createVehiculo(req, res) {
        try {
            const vehiculoData = req.body;

            // Validar que el ID sea un número
            if (isNaN(vehiculoData.id)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID debe ser un número'
                });
            }

            // Convertir el ID a número
            vehiculoData.id = Number(vehiculoData.id);

            // Validar que los pilotos sean números
            if (vehiculoData.pilotos && Array.isArray(vehiculoData.pilotos)) {
                vehiculoData.pilotos = vehiculoData.pilotos.map(id => Number(id));
            }

            const result = await VehiculoService.createVehiculo(vehiculoData);
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.status(201).json(result);
        } catch (error) {
            console.error('💥 VehiculoController - createVehiculo - Error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al crear el vehículo',
                error: error.message 
            });
        }
    }

    async updateVehiculo(req, res) {
        try {
            const { id } = req.params;
            const vehiculoData = req.body;

            // Validar que el ID sea un número
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID debe ser un número'
                });
            }

            // Convertir el ID a número
            const vehiculoId = Number(id);

            // Si se proporciona un ID en el body, asegurarse de que sea un número
            if (vehiculoData.id) {
                vehiculoData.id = Number(vehiculoData.id);
            }

            // Si se proporcionan pilotos, asegurarse de que sean números
            if (vehiculoData.pilotos && Array.isArray(vehiculoData.pilotos)) {
                vehiculoData.pilotos = vehiculoData.pilotos.map(id => Number(id));
            }

            const result = await VehiculoService.updateVehiculo(vehiculoId, vehiculoData);
            if (!result.success) {
                return res.status(404).json(result);
            }
            res.json(result);
        } catch (error) {
            console.error('💥 VehiculoController - updateVehiculo - Error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al actualizar el vehículo',
                error: error.message 
            });
        }
    }

    async deleteVehiculo(req, res) {
        try {
            const { id } = req.params;

            // Validar que el ID sea un número
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID debe ser un número'
                });
            }

            const result = await VehiculoService.deleteVehiculo(Number(id));
            if (!result.success) {
                return res.status(404).json(result);
            }
            res.json(result);
        } catch (error) {
            console.error('💥 VehiculoController - deleteVehiculo - Error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al eliminar el vehículo',
                error: error.message 
            });
        }
    }
}

module.exports = new VehiculoController(); 