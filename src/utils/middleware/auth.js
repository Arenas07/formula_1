const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: 'No autorizado' });
    }
};

const requireRole = (roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'No autorizado' });
            }

            if (!roles.includes(req.user.rol)) {
                return res.status(403).json({ message: 'No tienes permisos suficientes' });
            }

            next();
        } catch (error) {
            console.error('💥 Auth Middleware - requireRole - Error:', error);
            res.status(500).json({ message: 'Error al verificar permisos' });
        }
    };
};

module.exports = {
    requireAuth,
    requireRole
}; 