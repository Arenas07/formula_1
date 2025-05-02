const Vehiculo = require('./models/vehiculo.model');

class VehiculoRepository {
    async getVehiculos() {
        try {
            const vehiculos = await Vehiculo.find();
            return vehiculos;
        } catch (error) {
            console.error('💥 VehiculoRepository - getVehiculos - Error:', error);
            throw error;
        }
    }
}

module.exports = new VehiculoRepository(); 