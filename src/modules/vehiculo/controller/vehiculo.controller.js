const vehiculoService = require('../service/vehiculo.service');

class VehiculoController {
    async getVehiculos(req, res) {
        try {
            const result = await vehiculoService.getVehiculos();
            if (result.success) {
                console.log('✅ VehiculoController - getVehiculos - Todos los vehículos obtenidos');
                res.json({
                    status: '200',
                    message: 'Todos los vehículos obtenidos',
                    vehiculos: result.vehiculos
                });
            } else {
                console.log('❌ VehiculoController - getVehiculos - Error:', result.message);
                res.status(401).json({ message: result.message });
            }
        } catch (error) {
            console.error('💥 VehiculoController - getVehiculos - Error:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }
}

module.exports = new VehiculoController(); 