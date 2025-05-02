const mongoose = require('mongoose');

const equipoSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
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
    },
    fecha_fundacion: {
        type: Number,
        required: true
    },
    sede: {
        type: String,
        required: true
    },
    campeonatos: {
        type: Number,
        default: 0
    },
    victorias: {
        type: Number,
        default: 0
    },
    descripcion: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    presupuesto: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Equipo', equipoSchema); 