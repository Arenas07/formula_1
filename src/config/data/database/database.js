const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Configuración de MongoDB con autenticación
const MONGODB_URI = 'mongodb://root:example@localhost:27017/formula1?authSource=admin';
// db://user:password@host:port/database?authSource=admin

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');
        return true;
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        return false;
    }
};

const testConnection = async () => {
    try {
        const isConnected = mongoose.connection.readyState === 1;
        if (!isConnected) {
            return await connectDB();
        }
        return true;
    } catch (error) {
        console.error('Error probando conexión:', error);
        return false;
    }
};

mongoose.connection.on('error', err => {
    console.error('Error en la conexión de MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB desconectado. Intentando reconectar...');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = {
    connectDB,
    testConnection,
    connection: mongoose.connection
};