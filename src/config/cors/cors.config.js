const cors = require('cors');

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 horas
};

module.exports = cors(corsOptions); 