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
            const userId = req.session.userId;
            if (!userId) {
                return res.status(401).json({ message: 'No autorizado' });
            }

            const user = await userRepository.findById(userId);
            if (!user || !roles.includes(user.rol)) {
                return res.status(403).json({ message: 'No tienes permisos suficientes' });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Error al verificar permisos' });
        }
    };
};

module.exports = {
    requireAuth,
    requireRole
}; 