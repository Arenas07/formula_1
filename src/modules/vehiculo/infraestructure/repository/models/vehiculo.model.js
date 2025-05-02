const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    equipo: {
        type: String,
        required: true
    },
    modelo: {
        type: String,
        required: true
    },
    motor: {
        type: String,
        required: true
    },
    potencia: {
        type: Number,
        required: true
    },
    velocidad_maxima_kmh: {
        type: Number,
        required: true
    },
    aceleracion_0_100: {
        type: Number,
        required: true
    },
    pilotos: [{
        type: Number,
        ref: 'Piloto'
    }],
    dimensiones: {
        peso: { type: Number, required: true },
        longitud: { type: Number, required: true },
        anchura: { type: Number, required: true },
        altura: { type: Number, required: true }
    }
});

module.exports = mongoose.model('Vehiculo', vehiculoSchema); 