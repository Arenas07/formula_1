require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const { testConnection } = require('./database/database');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400
};
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'formula1_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: process.env.SWAGGER_TITLE || 'API de Fórmula 1',
            version: process.env.SWAGGER_VERSION || '1.0.0',
            description: process.env.SWAGGER_DESCRIPTION || 'API para gestionar datos de Fórmula 1',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Servidor de desarrollo',
            },
        ],
    },
    apis: ['./src/modules/**/*.js'], // Ajusta esta ruta según tu estructura de proyecto
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Importar rutas
const authRoutes = require('../../modules/auth/auth.routes');
const pilotoRoutes = require('../../modules/pilotos/piloto.routes');
const equipoRoutes = require('../../modules/equipo/equipo.routes');
const vehiculoRoutes = require('../../modules/vehiculo/vehiculo.routes');
const circuitoRoutes = require('../../modules/circuito/circuito.routes');
const usuarioRoutes = require('../../modules/usuario/infraestructure/routes/usuario.routes');
const simulacionRoutes = require('../../modules/simulacion/simulacion.routes');

app.use('/auth', authRoutes);
app.use('/api', pilotoRoutes);
app.use('/api', equipoRoutes);
app.use('/api', vehiculoRoutes);
app.use('/api', circuitoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/simulacion', simulacionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Fórmula 1 funcionando correctamente' });
});

// Ruta de salud
app.get('/health', async (req, res) => {
    try {
        const dbConnected = await testConnection();
        res.status(200).json({ 
            status: 'ok', 
            database: dbConnected ? 'connected' : 'disconnected' 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: 'Error checking database connection' 
        });
    }
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Algo salió mal!',
        message: err.message 
    });
});

// Iniciar el servidor
const startServer = async () => {
    try {
        // Probar conexión a la base de datos antes de iniciar el servidor
        const dbConnected = await testConnection();
        if (!dbConnected) {
            console.error('No se pudo conectar a la base de datos. Deteniendo la aplicación.');
            process.exit(1);
        }

        app.listen(port, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
            console.log(`📄 Documentación de la API disponible en http://localhost:${port}/api-docs`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();