const { body, param, validationResult } = require('express-validator');
const ResponseHandler = require('../../../shared/response/ResponseHandler');

// Middleware para validar los resultados de la validación
const validarResultados = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ResponseHandler.validationError(res, errors.array());
    }
    next();
};

// Validaciones para la configuración
const validarConfiguracion = [
    // Validar ID del usuario
    body('usuario_id')
        .isMongoId()
        .withMessage('El ID del usuario debe ser un ObjectId válido'),

    // Validar ID del piloto
    body('piloto_id')
        .isMongoId()
        .withMessage('El ID del piloto debe ser un ObjectId válido'),

    // Validar ID del vehículo
    body('vehiculo_id')
        .isMongoId()
        .withMessage('El ID del vehículo debe ser un ObjectId válido'),

    // Validar ID del circuito
    body('circuito_id')
        .isMongoId()
        .withMessage('El ID del circuito debe ser un ObjectId válido'),

    // Validar configuración
    body('configuracion')
        .isObject()
        .withMessage('La configuración debe ser un objeto'),

    // Validar aerodinámica
    body('configuracion.aerodinamica')
        .isIn(['baja', 'media', 'alta'])
        .withMessage('La aerodinámica debe ser baja, media o alta'),

    // Validar presión neumática
    body('configuracion.presion_neumatica')
        .isIn(['baja', 'media', 'alta'])
        .withMessage('La presión neumática debe ser baja, media o alta'),

    // Validar tipo de conducción
    body('configuracion.tipo_conduccion')
        .isIn(['normal', 'agresiva', 'ahorro_combustible'])
        .withMessage('El tipo de conducción debe ser normal, agresiva o ahorro_combustible'),

    // Validar carga aerodinámica
    body('configuracion.carga_aerodinamica')
        .isIn(['baja', 'media', 'alta'])
        .withMessage('La carga aerodinámica debe ser baja, media o alta'),

    // Validar estrategia
    body('configuracion.estrategia')
        .isIn(['agresiva', 'balanceada', 'ahorro'])
        .withMessage('La estrategia debe ser agresiva, balanceada o ahorro'),

    // Validar clima
    body('clima')
        .isIn(['seco', 'lluvioso', 'extremo'])
        .withMessage('El clima debe ser seco, lluvioso o extremo')
];

// Validaciones para el ID en los parámetros
const validarId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo')
];

module.exports = {
    validarResultados,
    validarConfiguracion,
    validarId
}; 