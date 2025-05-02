const VehiculoRepository = require('../infraestructure/repository/vehiculo.repository');

class VehiculoService {
    async getVehiculos() {
        try {
            const vehiculos = await VehiculoRepository.getVehiculos();
            if (vehiculos.length === 0) {
                console.log('❌ VehiculoService - getVehiculos - No hay vehículos disponibles');
                return { success: false, message: 'No hay vehículos disponibles' };
            }
            console.log('✅ VehiculoService - getVehiculos - Todos los vehículos obtenidos');
            return { success: true, vehiculos };
        } catch (error) {
            console.error('💥 VehiculoService - getVehiculos - Error:', error);
            throw error;
        }
    }
}

module.exports = new VehiculoService(); 