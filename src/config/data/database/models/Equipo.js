const mongoose = require('mongoose');

const equipoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    pais: {
        type: String,
        required: true
    },
    motor: {
        type: String,
        required: true
    },
    pilotos: [{
        type: Number,
        ref: 'Piloto'
    }],
    imagen: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Equipo', equipoSchema);