const usuarioRepository = require('../infraestructure/repository/usuario.repository');
const bcrypt = require('bcrypt');

class UsuarioService {
    async getAllUsuarios() {
        try {
            return await usuarioRepository.findAll();
        } catch (error) {
            throw new Error('Error al obtener los usuarios: ' + error.message);
        }
    }

    async getUsuarioById(id) {
        try {
            const usuario = await usuarioRepository.findById(id);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            return usuario;
        } catch (error) {
            throw new Error('Error al obtener el usuario: ' + error.message);
        }
    }

    async createUsuario(usuarioData) {
        try {
            const usuarioExistente = await usuarioRepository.findByEmail(usuarioData.email);
            if (usuarioExistente) {
                throw new Error('El email ya está registrado');
            }

            const hashedPassword = await bcrypt.hash(usuarioData.password, 10);
            usuarioData.password = hashedPassword;

            return await usuarioRepository.create(usuarioData);
        } catch (error) {
            throw new Error('Error al crear el usuario: ' + error.message);
        }
    }

    async updateUsuario(id, usuarioData) {
        try {
            if (usuarioData.password) {
                usuarioData.password = await bcrypt.hash(usuarioData.password, 10);
            }
            return await usuarioRepository.update(id, usuarioData);
        } catch (error) {
            throw new Error('Error al actualizar el usuario: ' + error.message);
        }
    }

    async deleteUsuario(id) {
        try {
            return await usuarioRepository.delete(id);
        } catch (error) {
            throw new Error('Error al eliminar el usuario: ' + error.message);
        }
    }
}

module.exports = new UsuarioService(); 