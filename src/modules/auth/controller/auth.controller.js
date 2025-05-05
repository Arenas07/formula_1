const bcrypt = require('bcryptjs');
const { generateToken } = require('../../../utils/middleware/jwt');
const ResponseHandler = require('../../../shared/response/ResponseHandler');
const UserRepository = require('../infraestructure/repository/user.repository');
const authService = require('../service/auth.service');

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            console.log('🔍 AuthController - login - Datos recibidos:', { email });

            // Buscar usuario por email
            const user = await UserRepository.findByEmail(email);
            if (!user) {
                console.log('❌ AuthController - login - Usuario no encontrado');
                return ResponseHandler.unauthorized(res, 'Credenciales inválidas');
            }

            // Verificar contraseña
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                console.log('❌ AuthController - login - Contraseña incorrecta');
                return ResponseHandler.unauthorized(res, 'Credenciales inválidas');
            }

            // Generar token JWT
            const token = generateToken(user);
            console.log('✅ AuthController - login - Login exitoso');

            // Enviar respuesta
            return ResponseHandler.success(res, {
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    nombre: user.nombre,
                    rol: user.rol
                }
            });
        } catch (error) {
            console.error('💥 AuthController - login - Error:', error);
            return ResponseHandler.serverError(res, 'Error al iniciar sesión');
        }
    }

    async register(req, res) {
        try {
            const { email, password, nombre } = req.body;
            console.log('🔍 AuthController - register - Datos recibidos:', { email, nombre });

            // Verificar si el usuario ya existe
            const existingUser = await UserRepository.findByEmail(email);
            if (existingUser) {
                console.log('❌ AuthController - register - Email ya registrado');
                return ResponseHandler.conflict(res, 'El email ya está registrado');
            }

            // Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Crear usuario
            const user = await UserRepository.create({
                email,
                password: hashedPassword,
                nombre,
                rol: 'usuario'
            });

            // Generar token JWT
            const token = generateToken(user);
            console.log('✅ AuthController - register - Registro exitoso');

            // Enviar respuesta
            return ResponseHandler.created(res, {
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    nombre: user.nombre,
                    rol: user.rol
                }
            });
        } catch (error) {
            console.error('💥 AuthController - register - Error:', error);
            return ResponseHandler.serverError(res, 'Error al registrar usuario');
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
        try {
            const userId = req.user._id;
            const user = await UserRepository.findById(userId);
            
            if (!user) {
                return ResponseHandler.notFound(res, 'Usuario no encontrado');
            }

            return ResponseHandler.success(res, {
                _id: user._id,
                email: user.email,
                rol: user.rol
            });
        } catch (error) {
            console.error('💥 AuthController - getProfile - Error:', error);
            return ResponseHandler.serverError(res, 'Error al obtener perfil');
        }
    }

    async registerAdmin(req, res) {
        console.log('🔍 AuthController - registerAdmin - Iniciando proceso de registro de administrador');
        try {
            const { email, password, nombre } = req.body;
            console.log('📧 AuthController - registerAdmin - Datos recibidos:', { email, nombre });
            const result = await authService.registerAdmin(email, password, nombre);
            
            if (result.success) {
                console.log('✅ AuthController - registerAdmin - Registro exitoso');
                res.status(201).json({
                    status: '201',
                    message: 'Administrador registrado exitosamente',
                    user: result.user
                });
            } else {
                console.log('❌ AuthController - registerAdmin - Registro fallido:', result.message);
                res.status(400).json({ message: result.message });
            }
        } catch (error) {
            console.error('💥 AuthController - registerAdmin - Error:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    async getCurrentUserRole(req, res) {
        try {
            // El usuario ya está disponible en req.user gracias al middleware verifyToken
            const { rol } = req.user;
            
            return ResponseHandler.success(res, { rol }, 'Rol obtenido exitosamente');
        } catch (error) {
            console.error('💥 AuthController - getCurrentUserRole - Error:', error);
            return ResponseHandler.serverError(res, 'Error al obtener el rol del usuario');
        }
    }
}

module.exports = new AuthController(); 