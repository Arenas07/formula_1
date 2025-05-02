const Usuario = require('./models/usuario.model');

class UsuarioRepository {
    async findAll() {
        return await Usuario.find({}, { password: 0 });
    }

    async findById(id) {
        return await Usuario.findById(id, { password: 0 });
    }

    async findByEmail(email) {
        return await Usuario.findOne({ email });
    }

    async create(usuarioData) {
        const usuario = new Usuario(usuarioData);
        return await usuario.save();
    }

    async update(id, usuarioData) {
        return await Usuario.findByIdAndUpdate(id, usuarioData, { new: true, select: '-password' });
    }

    async delete(id) {
        return await Usuario.findByIdAndDelete(id);
    }
}

module.exports = new UsuarioRepository(); 