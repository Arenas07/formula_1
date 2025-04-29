const mongoose = require('mongoose');

const pilotoSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    equipo: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true,
        enum: ['Líder', 'Escudero']
    }
});

module.exports = mongoose.model('Piloto', pilotoSchema); 