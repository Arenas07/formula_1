const userRepository = require('../infraestructure/user.repository');
const { comparePasswords, hashPassword } = require('../../utils/security/password');

class AuthService {
    async login(email, password) {
        try {
            const user = await userRepository.findByEmail(email);
            
            if (!user) {
                return {
                    success: false,
                    message: 'Usuario no encontrado'
                };
            }

            const isValidPassword = await comparePasswords(password, user.password);
            
            if (!isValidPassword) {
                return {
                    success: false,
                    message: 'Contraseña incorrecta'
                };
            }

            return {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    nombre: user.nombre
                }
            };
        } catch (error) {
            throw new Error('Error en el proceso de autenticación');
        }
    }

    async register(email, password, nombre) {
        try {
            // Verificar si el email ya existe
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                return {
                    success: false,
                    message: 'El email ya está registrado'
                };
            }

            // Hashear la contraseña
            const hashedPassword = await hashPassword(password);

            // Crear el usuario
            const userData = {
                email,
                password: hashedPassword,
                nombre
            };

            const newUser = await userRepository.create(userData);

            return {
                success: true,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    nombre: newUser.nombre
                }
            };
        } catch (error) {
            throw new Error('Error en el proceso de registro');
        }
    }

    async getUserProfile(userId) {
        try {
            const user = await userRepository.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return {
                id: user.id,
                email: user.email,
                nombre: user.nombre
            };
        } catch (error) {
            throw new Error('Error al obtener el perfil del usuario');
        }
    }
}

module.exports = new AuthService();
