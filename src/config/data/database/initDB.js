const mongoose = require('mongoose');
const Piloto = require('./models/Piloto');
const Equipo = require('./models/Equipo');

const pilotos = [
    { id: 1, nombre: "Max Verstappen", equipo: "Red Bull Racing", rol: "Líder" },
    { id: 2, nombre: "Sergio Pérez", equipo: "Red Bull Racing", rol: "Escudero" },
    { id: 3, nombre: "Lewis Hamilton", equipo: "Mercedes-AMG Petronas", rol: "Líder" },
    { id: 4, nombre: "George Russell", equipo: "Mercedes-AMG Petronas", rol: "Escudero" },
    { id: 5, nombre: "Charles Leclerc", equipo: "Ferrari", rol: "Líder" },
    { id: 6, nombre: "Carlos Sainz", equipo: "Ferrari", rol: "Escudero" },
    { id: 7, nombre: "Lando Norris", equipo: "McLaren", rol: "Líder" },
    { id: 8, nombre: "Oscar Piastri", equipo: "McLaren", rol: "Escudero" },
    { id: 9, nombre: "Fernando Alonso", equipo: "Aston Martin", rol: "Líder" },
    { id: 10, nombre: "Lance Stroll", equipo: "Aston Martin", rol: "Escudero" },
    { id: 11, nombre: "Esteban Ocon", equipo: "Alpine", rol: "Líder" },
    { id: 12, nombre: "Pierre Gasly", equipo: "Alpine", rol: "Escudero" },
    { id: 13, nombre: "Valtteri Bottas", equipo: "Alfa Romeo", rol: "Líder" },
    { id: 14, nombre: "Zhou Guanyu", equipo: "Alfa Romeo", rol: "Escudero" },
    { id: 15, nombre: "Kevin Magnussen", equipo: "Haas", rol: "Líder" },
    { id: 16, nombre: "Nico Hülkenberg", equipo: "Haas", rol: "Escudero" },
    { id: 17, nombre: "Yuki Tsunoda", equipo: "AlphaTauri", rol: "Líder" },
    { id: 18, nombre: "Daniel Ricciardo", equipo: "AlphaTauri", rol: "Escudero" },
    { id: 19, nombre: "Alexander Albon", equipo: "Williams", rol: "Líder" },
    { id: 20, nombre: "Logan Sargeant", equipo: "Williams", rol: "Escudero" }
];

const equipos = [
    {
        nombre: "Red Bull Racing",
        pais: "Austria",
        motor: "Honda",
        pilotos: [1, 2],
        imagen: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Red_Bull_Racing_Logo.svg"
    },
    {
        nombre: "Mercedes-AMG Petronas",
        pais: "Alemania",
        motor: "Mercedes",
        pilotos: [3, 4],
        imagen: "https://upload.wikimedia.org/wikipedia/commons/3/32/Mercedes_AMG_Petronas_F1_Team_logo.svg"
    },
    {
        nombre: "Ferrari",
        pais: "Italia",
        motor: "Ferrari",
        pilotos: [5, 6],
        imagen: "https://upload.wikimedia.org/wikipedia/en/d/d4/Scuderia_Ferrari_Logo.svg"
    }
];

const initDB = async () => {
    try {
        // Conectar a MongoDB en el puerto 27017
        await mongoose.connect('mongodb://root:example@localhost:27017/formula1?authSource=admin');
        console.log('✅ Conectado a MongoDB');

        // Limpiar colecciones existentes
        await Piloto.deleteMany({});
        await Equipo.deleteMany({});
        console.log('🗑️ Colecciones limpiadas');

        // Insertar pilotos
        await Piloto.insertMany(pilotos);
        console.log('👤 Pilotos insertados');

        // Insertar equipos
        await Equipo.insertMany(equipos);
        console.log('🏎️ Equipos insertados');

        console.log('✅ Base de datos inicializada correctamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error inicializando la base de datos:', error);
        process.exit(1);
    }
};

initDB(); 