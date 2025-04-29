const authService = require('../service/auth.service');

class AuthController {
    async login(req, res) {
        console.log('🔍 AuthController - login - Iniciando proceso de login');
        try {
            const { email, password } = req.body;
            console.log('📧 AuthController - login - Datos recibidos:', { email });
            const result = await authService.login(email, password);
            
            if (result.success) {
                console.log('✅ AuthController - login - Login exitoso');
                req.session.userId = result.user.id;
                res.json({
                    message: 'Login exitoso',
                    user: result.user
                });
            } else {
                console.log('❌ AuthController - login - Login fallido:', result.message);
                res.status(401).json({ message: result.message });
            }
        } catch (error) {
            console.error('💥 AuthController - login - Error:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    async register(req, res) {
        console.log('🔍 AuthController - register - Iniciando proceso de registro');
        try {
            const { email, password, nombre } = req.body;
            console.log('📧 AuthController - register - Datos recibidos:', { email, nombre });
            const result = await authService.register(email, password, nombre);
            
            if (result.success) {
                console.log('✅ AuthController - register - Registro exitoso');
                res.status(201).json({
                    message: 'Usuario registrado exitosamente',
                    user: result.user
                });
            } else {
                console.log('❌ AuthController - register - Registro fallido:', result.message);
                res.status(400).json({ message: result.message });
            }
        } catch (error) {
            console.error('💥 AuthController - register - Error:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    async logout(req, res) {
        console.log('🔍 AuthController - logout - Iniciando proceso de logout');
        try {
            req.session.destroy();
            console.log('✅ AuthController - logout - Sesión cerrada');
            res.json({ message: 'Sesión cerrada' });
        } catch (error) {
            console.error('💥 AuthController - logout - Error:', error);
            res.status(500).json({ message: 'Error al cerrar sesión' });
        }
    }

    async getProfile(req, res) {
        console.log('🔍 AuthController - getProfile - Iniciando proceso de obtener perfil');
        try {
            const userId = req.session.userId;
            console.log('👤 AuthController - getProfile - ID de usuario:', userId);
            const user = await authService.getUserProfile(userId);
            console.log('✅ AuthController - getProfile - Perfil obtenido');
            res.json(user);
        } catch (error) {
            console.error('💥 AuthController - getProfile - Error:', error);
            res.status(500).json({ message: 'Error al obtener el perfil' });
        }
    }
}

module.exports = new AuthController(); 