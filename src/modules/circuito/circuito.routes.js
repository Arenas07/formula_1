const express = require('express');
const router = express.Router();
const circuitoController = require('./controller/circuito.controller');

router.get('/circuitos', (req, res) => circuitoController.getCircuitos(req, res));

module.exports = router; 