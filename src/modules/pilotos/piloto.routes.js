const express = require('express');
const router = express.Router();
const PilotoController = require('./controller/piloto.controller');

const pilotoController = new PilotoController();

/**
 * @swagger
 * /pilotos:
 *   get:
 *     summary: Obtener todos los pilotos
 *     tags: [Pilotos]
 *     responses:
 *       200:
 *         description: Lista de pilotos
 */
router.get('/pilotos', (req, res) => pilotoController.getPilotos(req, res));

/**
 * @swagger
 * /pilotos/{id}:
 *   get:
 *     summary: Obtener piloto por ID
 *     tags: [Pilotos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del piloto
 *     responses:
 *       200:
 *         description: Piloto encontrado
 *       404:
 *         description: Piloto no encontrado
 */
router.get('/pilotos/:id', (req, res) => pilotoController.getPilotoById(req, res));

/**
 * @swagger
 * /pilotos/nuevo:
 *   post:
 *     summary: Crear piloto nuevo (estadísticas en 0)
 *     tags: [Pilotos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Piloto nuevo creado
 */
router.post('/pilotos/nuevo', (req, res) => pilotoController.createPilotoNuevo(req, res));

/**
 * @swagger
 * /pilotos/competidor:
 *   post:
 *     summary: Crear piloto que ya compite (estadísticas desde el request)
 *     tags: [Pilotos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Piloto competidor creado
 */
router.post('/pilotos/competidor', (req, res) => pilotoController.createPilotoCompetidor(req, res));

/**
 * @swagger
 * /pilotos/{id}:
 *   put:
 *     summary: Actualizar piloto
 *     tags: [Pilotos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del piloto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Piloto actualizado
 *       404:
 *         description: Piloto no encontrado
 */
router.put('/pilotos/:id', (req, res) => pilotoController.updatePiloto(req, res));

/**
 * @swagger
 * /pilotos/{id}:
 *   delete:
 *     summary: Eliminar piloto
 *     tags: [Pilotos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del piloto
 *     responses:
 *       200:
 *         description: Piloto eliminado
 *       404:
 *         description: Piloto no encontrado
 */
router.delete('/pilotos/:id', (req, res) => pilotoController.deletePiloto(req, res));

module.exports = router;
