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
}

module.exports = new EquipoRepository();
