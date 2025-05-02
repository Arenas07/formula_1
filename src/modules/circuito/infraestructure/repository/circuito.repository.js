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
}

module.exports = new CircuitoRepository(); 