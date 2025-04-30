const mongoose = require('mongoose');

const configuracionSimulacionSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    piloto_id: {
        type: Number,
        ref: 'Piloto',
        required: true
    },
    vehiculo_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehiculo',
        required: true
    },
    circuito_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Circuito',
        required: true
    },
    configuracion: {
        aerodinamica: {
            type: String,
            enum: ['baja', 'media', 'alta'],
            required: true
        },
        presion_neumatica: {
            type: String,
            enum: ['baja', 'media', 'alta'],
            required: true
        },
        tipo_conduccion: {
            type: String,
            enum: ['normal', 'agresiva', 'ahorro_combustible'],
            required: true
        },
        carga_aerodinamica: {
            type: String,
            enum: ['baja', 'media', 'alta'],
            required: true
        },
        estrategia: {
            type: String,
            enum: ['agresiva', 'balanceada', 'ahorro'],
            required: true
        }
    },
    clima: {
        type: String,
        enum: ['seco', 'lluvioso', 'extremo'],
        required: true
    },
    fecha_simulacion: {
        type: Date,
        default: Date.now
    },
    resultados: {
        tiempo_total: String,
        posicion_final: Number,
        vueltas_completadas: Number,
        consumo_combustible: Number,
        desgaste_neumaticos: Number
    }
});

module.exports = mongoose.model('ConfiguracionSimulacion', configuracionSimulacionSchema); 