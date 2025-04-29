const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Fórmula 1',
            version: '1.0.0',
            description: 'API para el sistema de Fórmula 1',
        },
        servers: [
            {
                url: process.env.API_URL || 'http://localhost:3000',
                description: 'Servidor de desarrollo',
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Ruta donde estarán tus rutas con la documentación
};

const specs = swaggerJsdoc(options);

module.exports = specs; 