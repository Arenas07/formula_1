const express = require('express');
const router = express.Router();
const equipoController = require('./controller/equipo.controller');

router.get('/equipos', (req, res) => equipoController.getEquipos(req, res));

module.exports = router; 