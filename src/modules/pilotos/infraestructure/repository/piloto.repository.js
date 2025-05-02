const Piloto = require('./models/piloto.model');

class PilotoRepository {
    async getPilotos() {
        try {
            const pilotos = await Piloto.find();
            return pilotos;
        } catch (error) {
            console.error('💥 PilotoRepository - getPilotos - Error:', error);
            throw error;
        }
    }

    async createPiloto(pilotoData) {
        try {
            const piloto = new Piloto(pilotoData);
            await piloto.save();
            return piloto;
        } catch (error) {
            console.error('💥 PilotoRepository - createPiloto - Error:', error);
            throw error;
        }
    }
}

module.exports = new PilotoRepository();
