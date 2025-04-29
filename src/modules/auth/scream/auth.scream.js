const { validationResult } = require('express-validator');

// Validaciones para el login
const validateLogin = [
    // Validar email
    (req, res, next) => {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'El email es requerido' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'El formato del email no es válido' });
        }
        next();
    },
    // Validar contraseña
    (req, res, next) => {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: 'La contraseña es requerida' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }
        next();
    }
];

// Validaciones para el registro
const validateRegister = [
    // Validar email
    (req, res, next) => {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'El email es requerido' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'El formato del email no es válido' });
        }
        next();
    },
    // Validar contraseña
    (req, res, next) => {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: 'La contraseña es requerida' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return res.status(400).json({ 
                message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número' 
            });
        }
        next();
    },
    // Validar nombre
    (req, res, next) => {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ message: 'El nombre es requerido' });
        }
        if (nombre.length < 2) {
            return res.status(400).json({ message: 'El nombre debe tener al menos 2 caracteres' });
        }
        next();
    }
];

// Middleware para validar los resultados
const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: 'Error de validación',
            errors: errors.array() 
        });
    }
    next();
};

module.exports = {
    validateLogin,
    validateRegister,
    validateResults
};





