const Circuito = require('./models/circuito.model');

class CircuitoRepository {
    async getCircuitos() {
        try {
            const circuitos = await Circuito.find();
            return circuitos;
        } catch (error) {
            console.error('💥 CircuitoRepository - getCircuitos - Error:', error);
            throw error;
        }
    }

    async getCircuitoById(id) {
        try {
            const circuito = await Circuito.findOne({ id });
            return circuito;
        } catch (error) {
            console.error('💥 CircuitoRepository - getCircuitoById - Error:', error);
            throw error;
        }
    }

    async createCircuito(circuitoData) {
        try {
            const circuito = new Circuito(circuitoData);
            const savedCircuito = await circuito.save();
            return savedCircuito;
        } catch (error) {
            console.error('💥 CircuitoRepository - createCircuito - Error:', error);
            throw error;
        }
    }

    async updateCircuito(id, circuitoData) {
        try {
            const updatedCircuito = await Circuito.findOneAndUpdate(
                { id },
                circuitoData,
                { new: true, runValidators: true }
            );
            return updatedCircuito;
        } catch (error) {
            console.error('💥 CircuitoRepository - updateCircuito - Error:', error);
            throw error;
        }
    }

    async deleteCircuito(id) {
        try {
            const deletedCircuito = await Circuito.findOneAndDelete({ id });
            return deletedCircuito;
        } catch (error) {
            console.error('💥 CircuitoRepository - deleteCircuito - Error:', error);
            throw error;
        }
    }
}

module.exports = new CircuitoRepository(); 