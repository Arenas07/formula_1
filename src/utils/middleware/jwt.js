const jwt = require('jsonwebtoken');
const ResponseHandler = require('../../shared/response/ResponseHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'formula1_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return ResponseHandler.unauthorized(res, 'Token no proporcionado');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return ResponseHandler.unauthorized(res, 'Formato de token inválido');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return ResponseHandler.unauthorized(res, 'Token expirado');
        }
        return ResponseHandler.unauthorized(res, 'Token inválido');
    }
};

// Función para generar token JWT
const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            rol: user.rol
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

module.exports = {
    verifyToken,
    generateToken,
    JWT_SECRET,
    JWT_EXPIRES_IN
}; 