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

    async getPilotoById(id) {
        try {
            const piloto = await Piloto.findOne({ id: Number(id) });
            return piloto;
        } catch (error) {
            console.error('💥 PilotoRepository - getPilotoById - Error:', error);
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

    async updatePiloto(id, pilotoData) {
        try {
            const piloto = await Piloto.findOneAndUpdate(
                { id: Number(id) },
                { $set: pilotoData },
                { new: true, runValidators: true }
            );
            return piloto;
        } catch (error) {
            console.error('💥 PilotoRepository - updatePiloto - Error:', error);
            throw error;
        }
    }

    async deletePiloto(id) {
        try {
            const piloto = await Piloto.findOneAndDelete({ id: Number(id) });
            return piloto;
        } catch (error) {
            console.error('💥 PilotoRepository - deletePiloto - Error:', error);
            throw error;
        }
    }
}

// Exportar una instancia del repositorio
const pilotoRepository = new PilotoRepository();
module.exports = pilotoRepository;
