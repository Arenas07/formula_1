const express = require('express');
const router = express.Router();
const SimulacionController = require('./controller/simulacion.controller');
const { validarResultados } = require('./scream/simulacion.scream');
const { validarConfiguracion } = require('./scream/simulacion.scream');
const { verifyToken } = require('../../utils/middleware/jwt');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Obtener todas las configuraciones
router.get('/configuraciones', SimulacionController.getConfiguraciones);

// Obtener una configuración específica
router.get('/configuraciones/:id', SimulacionController.getConfiguracionById);

// Crear una nueva configuración
router.post('/configuraciones', 
    validarConfiguracion,
    validarResultados,
    SimulacionController.createConfiguracion
);

// Actualizar una configuración existente
router.put('/configuraciones/:id',
    validarConfiguracion,
    validarResultados,
    SimulacionController.updateConfiguracion
);

// Eliminar una configuración
router.delete('/configuraciones/:id', SimulacionController.deleteConfiguracion);

// Ejecutar una simulación
router.post('/ejecutar',
    validarConfiguracion,
    validarResultados,
    SimulacionController.ejecutarSimulacion
);

module.exports = router; 