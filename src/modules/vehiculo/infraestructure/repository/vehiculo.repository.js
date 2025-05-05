const Vehiculo = require('./models/vehiculo.model');

class VehiculoRepository {
    async getVehiculos() {
        try {
            const vehiculos = await Vehiculo.find();
            return { success: true, vehiculos };
        } catch (error) {
            console.error('💥 VehiculoRepository - getVehiculos - Error:', error);
            throw error;
        }
    }

    async getVehiculoById(id) {
        try {
            const vehiculo = await Vehiculo.findOne({ id });
            if (!vehiculo) {
                return { success: false, message: 'Vehículo no encontrado' };
            }
            return { success: true, vehiculo };
        } catch (error) {
            console.error('💥 VehiculoRepository - getVehiculoById - Error:', error);
            throw error;
        }
    }

    async createVehiculo(vehiculoData) {
        try {
            const vehiculo = new Vehiculo(vehiculoData);
            await vehiculo.save();
            return { success: true, vehiculo };
        } catch (error) {
            console.error('💥 VehiculoRepository - createVehiculo - Error:', error);
            throw error;
        }
    }

    async updateVehiculo(id, vehiculoData) {
        try {
            const vehiculo = await Vehiculo.findOneAndUpdate(
                { id },
                vehiculoData,
                { new: true, runValidators: true }
            );

            if (!vehiculo) {
                return { success: false, message: 'Vehículo no encontrado' };
            }

            return { success: true, vehiculo };
        } catch (error) {
            console.error('💥 VehiculoRepository - updateVehiculo - Error:', error);
            throw error;
        }
    }

    async deleteVehiculo(id) {
        try {
            const vehiculo = await Vehiculo.findOneAndDelete({ id });
            if (!vehiculo) {
                return { success: false, message: 'Vehículo no encontrado' };
            }
            return { success: true };
        } catch (error) {
            console.error('💥 VehiculoRepository - deleteVehiculo - Error:', error);
            throw error;
        }
    }
}

module.exports = new VehiculoRepository(); 