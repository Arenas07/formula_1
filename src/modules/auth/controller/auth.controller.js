const authService = require('../service/auth.service');

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            
            if (result.success) {
                req.session.userId = result.user.id;
                res.json({
                    message: 'Login exitoso',
                    user: result.user
                });
            } else {
                res.status(401).json({ message: result.message });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    async register(req, res) {
        try {
            const { email, password, nombre } = req.body;
            const result = await authService.register(email, password, nombre);
            
            if (result.success) {
                res.status(201).json({
                    message: 'Usuario registrado exitosamente',
                    user: result.user
                });
            } else {
                res.status(400).json({ message: result.message });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    async logout(req, res) {
        try {
            req.session.destroy();
            res.json({ message: 'Sesión cerrada' });
        } catch (error) {
            res.status(500).json({ message: 'Error al cerrar sesión' });
        }
    }

    async getProfile(req, res) {
        try {
            const userId = req.session.userId;
            const user = await authService.getUserProfile(userId);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el perfil' });
        }
    }
}

module.exports = new AuthController(); 