const mongoose = require('mongoose');

const pilotoSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    broadcast_name: {
        type: String,
        required: true
    },
    country_code: {
        type: String,
        required: true
    },
    driver_number: {
        type: Number,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    headshot_url: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    meeting_key: {
        type: Number,
        required: true
    },
    name_acronym: {
        type: String,
        required: true
    },
    session_key: {
        type: Number,
        required: true
    },
    team_colour: {
        type: String,
        required: true
    },
    team_name: {
        type: String,
        required: true
    },
    estadisticas: {
        victorias: { type: Number, default: 0 },
        podios: { type: Number, default: 0 },
        poles: { type: Number, default: 0 },
        mejor_tiempo: { type: String },
        campeonatos_mundiales: { type: Number, default: 0 },
        puntos_f1: { type: Number, default: 0 }
    },
    biografia: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        enum: ['Líder', 'Escudero']
    },
    tipo_conduccion: {
        type: String,
        required: true,
        enum: ['normal', 'agresiva', 'ahorro_combustible']
    },
    estrategia: {
        type: String,
        required: true,
        enum: ['agresiva', 'balanceada', 'ahorro']
    }
});

module.exports = mongoose.model('Piloto', pilotoSchema); 