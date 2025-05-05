const express = require('express');
const router = express.Router();
const circuitoController = require('./controller/circuito.controller');
const { verifyToken } = require('../../utils/middleware/jwt');
const { requireRole } = require('../../utils/middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

/**
 * @swagger
 * /api/circuitos:
 *   get:
 *     tags:
 *       - Circuitos
 *     summary: Obtiene todos los circuitos
 *     description: Retorna una lista de todos los circuitos disponibles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de circuitos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 circuitos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Circuito'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/circuitos', requireRole(['admin', 'usuario']), circuitoController.getCircuitos);

/**
 * @swagger
 * /api/circuitos/{id}:
 *   get:
 *     tags:
 *       - Circuitos
 *     summary: Obtiene un circuito por ID
 *     description: Retorna los detalles de un circuito específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del circuito
 *     responses:
 *       200:
 *         description: Circuito encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 circuito:
 *                   $ref: '#/components/schemas/Circuito'
 *       404:
 *         description: Circuito no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/circuitos/:id', requireRole(['admin', 'usuario']), circuitoController.getCircuitoById);

/**
 * @swagger
 * /api/circuitos:
 *   post:
 *     tags:
 *       - Circuitos
 *     summary: Crea un nuevo circuito
 *     description: Crea un nuevo circuito con los datos proporcionados
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Circuito'
 *     responses:
 *       201:
 *         description: Circuito creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 circuito:
 *                   $ref: '#/components/schemas/Circuito'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos
 *       500:
 *         description: Error del servidor
 */
router.post('/circuitos', requireRole(['admin']), circuitoController.createCircuito);

/**
 * @swagger
 * /api/circuitos/{id}:
 *   put:
 *     tags:
 *       - Circuitos
 *     summary: Actualiza un circuito existente
 *     description: Actualiza los datos de un circuito específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del circuito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Circuito'
 *     responses:
 *       200:
 *         description: Circuito actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 circuito:
 *                   $ref: '#/components/schemas/Circuito'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos
 *       404:
 *         description: Circuito no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/circuitos/:id', requireRole(['admin']), circuitoController.updateCircuito);

/**
 * @swagger
 * /api/circuitos/{id}:
 *   delete:
 *     tags:
 *       - Circuitos
 *     summary: Elimina un circuito
 *     description: Elimina un circuito específico de la base de datos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del circuito
 *     responses:
 *       200:
 *         description: Circuito eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos
 *       404:
 *         description: Circuito no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/circuitos/:id', requireRole(['admin']), circuitoController.deleteCircuito);

module.exports = router; 