const { body, param, validationResult } = require('express-validator');
const ResponseHandler = require('../../../shared/response/ResponseHandler');

// Validaciones comunes para crear y actualizar pilotos
const validacionesComunes = [
    body('first_name')
        .optional()
        .isString()
        .withMessage('El nombre debe ser texto')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres'),

    body('last_name')
        .optional()
        .isString()
        .withMessage('El apellido debe ser texto')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('El apellido debe tener entre 2 y 50 caracteres'),

    body('country_code')
        .optional()
        .isString()
        .withMessage('El código de país debe ser texto')
        .trim()
        .isLength({ min: 3, max: 3 })
        .withMessage('El código de país debe tener exactamente 3 caracteres')
        .matches(/^[A-Z]{3}$/)
        .withMessage('El código de país debe ser 3 letras mayúsculas (ej: NED, ESP, GBR)'),

    body('driver_number')
        .optional()
        .isInt({ min: 1, max: 99 })
        .withMessage('El número del piloto debe ser un número entre 1 y 99'),

    body('headshot_url')
        .optional()
        .isURL()
        .withMessage('La URL de la foto debe ser válida'),

    body('team_colour')
        .optional()
        .isString()
        .withMessage('El color del equipo debe ser texto')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('El color del equipo debe tener entre 3 y 20 caracteres'),

    body('team_name')
        .optional()
        .isString()
        .withMessage('El nombre del equipo debe ser texto')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre del equipo debe tener entre 2 y 50 caracteres'),

    body('rol')
        .optional()
        .isString()
        .withMessage('El rol debe ser texto')
        .trim()
        .isIn(['Líder', 'Lider', 'Escudero'])
        .withMessage('El rol debe ser Líder o Escudero'),

    body('tipo_conduccion')
        .optional()
        .isString()
        .withMessage('El tipo de conducción debe ser texto')
        .trim()
        .isIn(['normal', 'agresiva', 'ahorro_combustible'])
        .withMessage('El tipo de conducción debe ser normal, agresiva o ahorro_combustible'),

    body('estrategia')
        .optional()
        .isString()
        .withMessage('La estrategia debe ser texto')
        .trim()
        .isIn(['agresiva', 'balanceada', 'ahorro'])
        .withMessage('La estrategia debe ser agresiva, balanceada o ahorro'),

    body('biografia')
        .optional()
        .isString()
        .withMessage('La biografía debe ser texto')
        .trim()
        .isLength({ max: 1000 })
        .withMessage('La biografía no puede exceder los 1000 caracteres')
];

// Validaciones específicas para estadísticas
const validacionesEstadisticas = [
    body('estadisticas.victorias')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Las victorias deben ser un número entero positivo'),

    body('estadisticas.podios')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Los podios deben ser un número entero positivo'),

    body('estadisticas.poles')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Las poles deben ser un número entero positivo'),

    body('estadisticas.mejor_tiempo')
        .optional()
        .isString()
        .withMessage('El mejor tiempo debe ser texto')
        .matches(/^\d{1,2}:\d{2}\.\d{3}$/)
        .withMessage('El mejor tiempo debe tener el formato MM:SS.mmm'),

    body('estadisticas.campeonatos_mundiales')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Los campeonatos mundiales deben ser un número entero positivo'),

    body('estadisticas.puntos_f1')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Los puntos F1 deben ser un número entero positivo')
];

// Validaciones para ID en parámetros
const validarId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo')
];

// Validaciones para crear piloto nuevo
const validarCrearPilotoNuevo = [
    ...validacionesComunes,
    body('first_name').notEmpty().withMessage('El nombre es requerido'),
    body('last_name').notEmpty().withMessage('El apellido es requerido'),
    body('country_code').notEmpty().withMessage('El código de país es requerido'),
    body('driver_number').notEmpty().withMessage('El número del piloto es requerido'),
    body('headshot_url').notEmpty().withMessage('La URL de la foto es requerida'),
    body('team_colour').notEmpty().withMessage('El color del equipo es requerido'),
    body('team_name').notEmpty().withMessage('El nombre del equipo es requerido'),
    body('rol').notEmpty().withMessage('El rol es requerido'),
    body('tipo_conduccion').notEmpty().withMessage('El tipo de conducción es requerido'),
    body('estrategia').notEmpty().withMessage('La estrategia es requerida')
];

// Validaciones para crear piloto competidor
const validarCrearPilotoCompetidor = [
    ...validacionesComunes,
    ...validacionesEstadisticas,
    body('first_name').notEmpty().withMessage('El nombre es requerido'),
    body('last_name').notEmpty().withMessage('El apellido es requerido'),
    body('country_code').notEmpty().withMessage('El código de país es requerido'),
    body('driver_number').notEmpty().withMessage('El número del piloto es requerido'),
    body('headshot_url').notEmpty().withMessage('La URL de la foto es requerida'),
    body('team_colour').notEmpty().withMessage('El color del equipo es requerido'),
    body('team_name').notEmpty().withMessage('El nombre del equipo es requerido'),
    body('rol').notEmpty().withMessage('El rol es requerido'),
    body('tipo_conduccion').notEmpty().withMessage('El tipo de conducción es requerido'),
    body('estrategia').notEmpty().withMessage('La estrategia es requerida'),
    body('estadisticas').notEmpty().withMessage('Las estadísticas son requeridas'),
    body('estadisticas.victorias').notEmpty().withMessage('Las victorias son requeridas'),
    body('estadisticas.podios').notEmpty().withMessage('Los podios son requeridos'),
    body('estadisticas.poles').notEmpty().withMessage('Las poles son requeridas'),
    body('estadisticas.mejor_tiempo').notEmpty().withMessage('El mejor tiempo es requerido'),
    body('estadisticas.campeonatos_mundiales').notEmpty().withMessage('Los campeonatos mundiales son requeridos'),
    body('estadisticas.puntos_f1').notEmpty().withMessage('Los puntos F1 son requeridos')
];

// Validaciones para actualizar piloto
const validarActualizarPiloto = [
    ...validacionesComunes,
    ...validacionesEstadisticas,
    ...validarId
];

// Middleware para validar resultados
const validarResultados = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(ResponseHandler.validationError(errors.array()));
    }
    next();
};

// Validación de ID
const validateId = [
    param('id')
        .isNumeric()
        .withMessage('El ID debe ser un número')
        .notEmpty()
        .withMessage('El ID es requerido')
];

// Validación de datos del piloto
const validatePiloto = [
    body('first_name')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isString()
        .withMessage('El nombre debe ser texto'),
    body('last_name')
        .notEmpty()
        .withMessage('El apellido es requerido')
        .isString()
        .withMessage('El apellido debe ser texto'),
    body('country_code')
        .notEmpty()
        .withMessage('El código de país es requerido')
        .isString()
        .withMessage('El código de país debe ser texto')
        .isLength({ min: 3, max: 3 })
        .withMessage('El código de país debe tener 3 caracteres'),
    body('driver_number')
        .notEmpty()
        .withMessage('El número de piloto es requerido')
        .isNumeric()
        .withMessage('El número de piloto debe ser un número'),
    body('headshot_url')
        .notEmpty()
        .withMessage('La URL de la foto es requerida')
        .isURL()
        .withMessage('La URL de la foto debe ser válida'),
    body('team_colour')
        .notEmpty()
        .withMessage('El color del equipo es requerido')
        .isString()
        .withMessage('El color del equipo debe ser texto'),
    body('team_name')
        .notEmpty()
        .withMessage('El nombre del equipo es requerido')
        .isString()
        .withMessage('El nombre del equipo debe ser texto'),
    body('rol')
        .notEmpty()
        .withMessage('El rol es requerido')
        .isIn(['Líder', 'Lider', 'Escudero'])
        .withMessage('El rol debe ser Líder o Escudero'),
    body('tipo_conduccion')
        .notEmpty()
        .withMessage('El tipo de conducción es requerido')
        .isIn(['normal', 'agresiva', 'ahorro_combustible'])
        .withMessage('El tipo de conducción debe ser normal, agresiva o ahorro_combustible'),
    body('estrategia')
        .notEmpty()
        .withMessage('La estrategia es requerida')
        .isIn(['agresiva', 'balanceada', 'ahorro'])
        .withMessage('La estrategia debe ser agresiva, balanceada o ahorro'),
    body('estadisticas')
        .optional()
        .isObject()
        .withMessage('Las estadísticas deben ser un objeto'),
    body('estadisticas.victorias')
        .optional()
        .isNumeric()
        .withMessage('Las victorias deben ser un número'),
    body('estadisticas.podios')
        .optional()
        .isNumeric()
        .withMessage('Los podios deben ser un número'),
    body('estadisticas.poles')
        .optional()
        .isNumeric()
        .withMessage('Las poles deben ser un número'),
    body('estadisticas.mejor_tiempo')
        .optional()
        .isString()
        .withMessage('El mejor tiempo debe ser texto'),
    body('estadisticas.campeonatos_mundiales')
        .optional()
        .isNumeric()
        .withMessage('Los campeonatos mundiales deben ser un número'),
    body('estadisticas.puntos_f1')
        .optional()
        .isNumeric()
        .withMessage('Los puntos de F1 deben ser un número'),
    body('biografia')
        .optional()
        .isString()
        .withMessage('La biografía debe ser texto')
];

// Middleware para validar los resultados
const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ResponseHandler.badRequest(res, 'Error de validación', errors.array());
    }
    next();
};

module.exports = {
    validarCrearPilotoNuevo,
    validarCrearPilotoCompetidor,
    validarActualizarPiloto,
    validarId,
    validarResultados,
    validateId,
    validatePiloto,
    validateResults
};
