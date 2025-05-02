const UserRepository = require('../infraestructure/repository/user.repository');
const bcrypt = require('bcrypt');

class AuthService {
    async login(email, password) {
        console.log('🔍 AuthService - login - Iniciando proceso de login');
        try {
            console.log('📧 AuthService - login - Buscando usuario:', email);
            const user = await UserRepository.findByEmail(email);
            
            if (!user) {
                console.log('❌ AuthService - login - Usuario no encontrado');
                return { success: false, message: 'Usuario no encontrado' };
            }

            console.log('🔑 AuthService - login - Verificando contraseña');
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                console.log('❌ AuthService - login - Contraseña incorrecta');
                return { success: false, message: 'Contraseña incorrecta' };
            }

            // Determinar el token_id según el rol
            const token_id = user.rol === 'admin' ? '1010' : '1000';

            console.log('✅ AuthService - login - Login exitoso');
            return { 
                success: true, 
                user: {
                    id: user._id,
                    email: user.email,
                    nombre: user.nombre,
                    rol: user.rol
                },
                token_id
            };
        } catch (error) {
            console.error('💥 AuthService - login - Error:', error);
            throw error;
        }
    }

    async register(email, password, nombre) {
        console.log('🔍 AuthService - register - Iniciando proceso de registro');
        try {
            console.log('📧 AuthService - register - Verificando usuario existente:', email);
            const existingUser = await UserRepository.findByEmail(email);
            
            if (existingUser) {
                console.log('❌ AuthService - register - Usuario ya existe');
                return { success: false, message: 'El usuario ya existe' };
            }

            console.log('🔑 AuthService - register - Encriptando contraseña');
            const hashedPassword = await bcrypt.hash(password, 10);
            
            console.log('👤 AuthService - register - Creando nuevo usuario');
            const user = await UserRepository.create({
                email,
                password: hashedPassword,
                nombre,
                rol: 'usuario' // Asignar rol por defecto
            });

            console.log('✅ AuthService - register - Usuario creado exitosamente');
            
            return { 
                success: true, 
                user: {
                    id: user._id,
                    email: user.email,
                    nombre: user.nombre,
                    rol: user.rol
                }
            };
        } catch (error) {
            console.error('💥 AuthService - register - Error:', error);
            throw error;
        }
    }

    async getUserProfile(userId) {
        console.log('🔍 AuthService - getUserProfile - Iniciando proceso de obtener perfil');
        try {
            console.log('👤 AuthService - getUserProfile - Buscando usuario:', userId);
            const user = await UserRepository.findById(userId);
            
            if (!user) {
                console.log('❌ AuthService - getUserProfile - Usuario no encontrado');
                throw new Error('Usuario no encontrado');
            }

            console.log('✅ AuthService - getUserProfile - Perfil obtenido');
            return {
                id: user._id,
                email: user.email,
                nombre: user.nombre
            };
        } catch (error) {
            console.error('💥 AuthService - getUserProfile - Error:', error);
            throw error;
        }
    }
}

module.exports = new AuthService();