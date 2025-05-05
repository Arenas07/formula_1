const ConfiguracionSimulacion = require('../../../../config/data/database/models/ConfiguracionSimulacion');

class SimulacionRepository {
    async getConfiguraciones(usuario_id) {
        try {
            return await ConfiguracionSimulacion.find({ usuario_id })
                .populate('piloto_id')
                .populate('vehiculo_id')
                .populate('circuito_id')
                .sort({ fecha_simulacion: -1 });
        } catch (error) {
            console.error('💥 SimulacionRepository - getConfiguraciones - Error:', error);
            throw error;
        }
    }

    async getConfiguracionById(id, usuario_id) {
        try {
            return await ConfiguracionSimulacion.findOne({ id, usuario_id })
                .populate('piloto_id')
                .populate('vehiculo_id')
                .populate('circuito_id');
        } catch (error) {
            console.error('💥 SimulacionRepository - getConfiguracionById - Error:', error);
            throw error;
        }
    }

    async createConfiguracion(data) {
        try {
            // Generar un ID único
            const ultimaConfiguracion = await ConfiguracionSimulacion.findOne().sort({ id: -1 });
            const nuevoId = ultimaConfiguracion ? ultimaConfiguracion.id + 1 : 1;

            const configuracion = new ConfiguracionSimulacion({
                ...data,
                id: nuevoId,
                fecha_simulacion: new Date()
            });

            return await configuracion.save();
        } catch (error) {
            console.error('💥 SimulacionRepository - createConfiguracion - Error:', error);
            throw error;
        }
    }

    async updateConfiguracion(id, usuario_id, data) {
        try {
            return await ConfiguracionSimulacion.findOneAndUpdate(
                { id, usuario_id },
                { ...data, fecha_simulacion: new Date() },
                { new: true, runValidators: true }
            ).populate('piloto_id')
             .populate('vehiculo_id')
             .populate('circuito_id');
        } catch (error) {
            console.error('💥 SimulacionRepository - updateConfiguracion - Error:', error);
            throw error;
        }
    }

    async deleteConfiguracion(id, usuario_id) {
        try {
            return await ConfiguracionSimulacion.findOneAndDelete({ id, usuario_id });
        } catch (error) {
            console.error('💥 SimulacionRepository - deleteConfiguracion - Error:', error);
            throw error;
        }
    }
}

module.exports = new SimulacionRepository(); 