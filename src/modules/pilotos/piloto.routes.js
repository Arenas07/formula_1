const express = require('express');
const router = express.Router();
const pilotoController = require('./controller/piloto.controller');
const { verifyToken } = require('../../utils/middleware/jwt');
const { validatePiloto, validateId, validateResults } = require('./scream/piloto.scream');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas principales de pilotos
router.get('/pilotos', pilotoController.getPilotos);
router.get('/pilotos/:id', validateId, validateResults, pilotoController.getPilotoById);
router.post('/pilotos', validatePiloto, validateResults, pilotoController.createPiloto);
router.put('/pilotos/:id', validateId, validatePiloto, validateResults, pilotoController.updatePiloto);
router.delete('/pilotos/:id', validateId, validateResults, pilotoController.deletePiloto);

// Rutas específicas para tipos de pilotos
router.post('/pilotos/nuevo', validatePiloto, validateResults, pilotoController.createPilotoNuevo);
router.post('/pilotos/competidor', validatePiloto, validateResults, pilotoController.createPilotoCompetidor);

/**
 * @swagger
 * tags:
 *   name: Pilotos
 *   description: API para gestión de pilotos
 */

/**
 * @swagger
 * /api/pilotos:
 *   get:
 *     summary: Obtener todos los pilotos
 *     tags: [Pilotos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pilotos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Piloto'
 */

/**
 * @swagger
 * /api/pilotos/{id}:
 *   get:
 *     summary: Obtener un piloto por ID
 *     tags: [Pilotos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Piloto encontrado exitosamente
 *       404:
 *         description: Piloto no encontrado
 */

/**
 * @swagger
 * /api/pilotos:
 *   post:
 *     summary: Crear un nuevo piloto
 *     tags: [Pilotos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Piloto'
 *     responses:
 *       201:
 *         description: Piloto creado exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/pilotos/{id}:
 *   put:
 *     summary: Actualizar un piloto
 *     tags: [Pilotos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Piloto'
 *     responses:
 *       200:
 *         description: Piloto actualizado exitosamente
 *       404:
 *         description: Piloto no encontrado
 */

/**
 * @swagger
 * /api/pilotos/{id}:
 *   delete:
 *     summary: Eliminar un piloto
 *     tags: [Pilotos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Piloto eliminado exitosamente
 *       404:
 *         description: Piloto no encontrado
 */

/**
 * @swagger
 * /api/pilotos/nuevo:
 *   post:
 *     summary: Crear un piloto nuevo (sin estadísticas)
 *     tags: [Pilotos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PilotoNuevo'
 *     responses:
 *       201:
 *         description: Piloto nuevo creado exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/pilotos/competidor:
 *   post:
 *     summary: Crear un piloto competidor (con estadísticas)
 *     tags: [Pilotos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PilotoCompetidor'
 *     responses:
 *       201:
 *         description: Piloto competidor creado exitosamente
 *       400:
 *         description: Datos inválidos
 */

module.exports = router;
