const Equipo = require('./models/equipo.model');

class EquipoRepository {
    async getEquipos() {
        try {
            const equipos = await Equipo.find();
            return equipos;
        } catch (error) {
            console.error('💥 EquipoRepository - getEquipos - Error:', error);
            throw error;
        }
    }

    async getEquipoById(id) {
        try {
            const equipo = await Equipo.findOne({ id });
            return equipo;
        } catch (error) {
            console.error('💥 EquipoRepository - getEquipoById - Error:', error);
            throw error;
        }
    }

    async createEquipo(equipoData) {
        try {
            const equipo = new Equipo(equipoData);
            await equipo.save();
            return equipo;
        } catch (error) {
            console.error('💥 EquipoRepository - createEquipo - Error:', error);
            throw error;
        }
    }

    async updateEquipo(id, equipoData) {
        try {
            const equipo = await Equipo.findOneAndUpdate(
                { id },
                equipoData,
                { new: true, runValidators: true }
            );
            return equipo;
        } catch (error) {
            console.error('💥 EquipoRepository - updateEquipo - Error:', error);
            throw error;
        }
    }

    async deleteEquipo(id) {
        try {
            const equipo = await Equipo.findOneAndDelete({ id });
            return equipo;
        } catch (error) {
            console.error('💥 EquipoRepository - deleteEquipo - Error:', error);
            throw error;
        }
    }
}

module.exports = new EquipoRepository();
