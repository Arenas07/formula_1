const usuarioService = require('../../application/usuario.service');

class UsuarioController {
    async getAllUsuarios(req, res) {
        try {
            const usuarios = await usuarioService.getAllUsuarios();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUsuarioById(req, res) {
        try {
            const usuario = await usuarioService.getUsuarioById(req.params.id);
            res.json(usuario);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async createUsuario(req, res) {
        try {
            const usuario = await usuarioService.createUsuario(req.body);
            res.status(201).json(usuario);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateUsuario(req, res) {
        try {
            const usuario = await usuarioService.updateUsuario(req.params.id, req.body);
            res.json(usuario);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteUsuario(req, res) {
        try {
            await usuarioService.deleteUsuario(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new UsuarioController(); 