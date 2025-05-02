const express = require('express');
const router = express.Router();
const vehiculoController = require('./controller/vehiculo.controller');

router.get('/vehiculos', (req, res) => vehiculoController.getVehiculos(req, res));

module.exports = router; 