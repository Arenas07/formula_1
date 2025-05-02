const mongoose = require('mongoose');

const circuitoSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    pais: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    continente: {
        type: String,
        required: true
    },
    longitud_km: {
        type: Number,
        required: true
    },
    vueltas: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    record_vuelta: {
        tiempo: String,
        piloto: String,
        año: Number
    },
    ganadores: [{
        temporada: Number,
        piloto: Number
    }],
    imagen: {
        type: String,
        required: true
    },
    imagen_destacada: {
        type: String,
        required: true
    },
    trazado: {
        type: String,
        required: true
    },
    curvas: {
        total: Number,
        izquierda: Number,
        derecha: Number
    },
    vueltas_carrera: {
        type: Number,
        required: true
    },
    distancia_carrera: {
        type: Number,
        required: true
    },
    zonas_drs: {
        cantidad: Number,
        ubicaciones: [String]
    },
    primer_gp: {
        type: Number,
        required: true
    },
    caracteristicas_tecnicas: {
        dificultad: {
            type: String,
            enum: ['baja', 'media', 'alta'],
            required: true
        },
        evolucion_pista: {
            type: String,
            required: true
        },
        dificultad_adelantamiento: {
            type: String,
            enum: ['baja', 'media', 'alta'],
            required: true
        },
        desgaste_neumaticos: {
            type: String,
            enum: ['bajo', 'medio', 'alto'],
            required: true
        },
        severidad_frenado: {
            type: String,
            enum: ['baja', 'media', 'alta'],
            required: true
        },
        clima_promedio: {
            type: String,
            required: true
        }
    },
    curvas_clave: [{
        nombre: String,
        descripcion: String,
        dificultad: String
    }],
    historia: {
        type: String,
        required: true
    },
    momentos_memorables: [{
        año: Number,
        suceso: String,
        imagen: String
    }]
});

module.exports = mongoose.model('Circuito', circuitoSchema); 