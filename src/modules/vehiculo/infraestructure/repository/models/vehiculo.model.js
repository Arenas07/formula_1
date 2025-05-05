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
    imagen: {
        type: String,
        required: true
    },
    pilotos: [{
        type: Number,
        required: true
    }],
    dimensiones: {
        peso: { type: Number, required: true },
        longitud: { type: Number, required: true },
        anchura: { type: Number, required: true },
        altura: { type: Number, required: true }
    },
    rendimiento: {
        conduccion_normal: {
            velocidad_promedio_kmh: { type: Number, required: true },
            consumo_combustible: {
                seco: { type: Number, required: true },
                lluvioso: { type: Number, required: true },
                extremo: { type: Number, required: true }
            },
            desgaste_neumaticos: {
                seco: { type: Number, required: true },
                lluvioso: { type: Number, required: true },
                extremo: { type: Number, required: true }
            }
        },
        conduccion_agresiva: {
            velocidad_promedio_kmh: { type: Number, required: true },
            consumo_combustible: {
                seco: { type: Number, required: true },
                lluvioso: { type: Number, required: true },
                extremo: { type: Number, required: true }
            },
            desgaste_neumaticos: {
                seco: { type: Number, required: true },
                lluvioso: { type: Number, required: true },
                extremo: { type: Number, required: true }
            }
        },
        ahorro_combustible: {
            velocidad_promedio_kmh: { type: Number, required: true },
            consumo_combustible: {
                seco: { type: Number, required: true },
                lluvioso: { type: Number, required: true },
                extremo: { type: Number, required: true }
            },
            desgaste_neumaticos: {
                seco: { type: Number, required: true },
                lluvioso: { type: Number, required: true },
                extremo: { type: Number, required: true }
            }
        }
    },
    innovaciones: [{
        nombre: String,
        descripcion: String,
        impacto: String
    }],
    aerodinamica: {
        tipo: { type: String, required: true }
    },
    presion_neumaticos: {
        tipo: { type: String, required: true },
        presion: { type: Number, required: true }
    },
    neumaticos: {
        tipo: { type: String, required: true }
    }
});

module.exports = mongoose.model('Vehiculo', vehiculoSchema); 