const mongoose = require('mongoose');

const configuracionSimulacionSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    piloto_id: {
        type: mongoose.Schema.Types.ObjectId,
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
        tiempo_total: {
            type: String,
            required: true
        },
        posicion_final: {
            type: Number,
            required: true,
            min: 1,
            max: 20
        },
        vueltas_completadas: {
            type: Number,
            required: true
        },
        consumo_combustible: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        desgaste_neumaticos: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        }
    }
}, {
    timestamps: true
});

// Índices para mejorar el rendimiento de las búsquedas
configuracionSimulacionSchema.index({ usuario_id: 1 });
configuracionSimulacionSchema.index({ piloto_id: 1 });
configuracionSimulacionSchema.index({ vehiculo_id: 1 });
configuracionSimulacionSchema.index({ circuito_id: 1 });
configuracionSimulacionSchema.index({ fecha_simulacion: -1 });

module.exports = mongoose.model('ConfiguracionSimulacion', configuracionSimulacionSchema); 