const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

// Obtener todos los usuarios
router.get('/', usuarioController.getAllUsuarios);

// Obtener un usuario por ID
router.get('/:id', usuarioController.getUsuarioById);

// Crear un nuevo usuario
router.post('/', usuarioController.createUsuario);

// Actualizar un usuario
router.put('/:id', usuarioController.updateUsuario);

// Eliminar un usuario
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router; 