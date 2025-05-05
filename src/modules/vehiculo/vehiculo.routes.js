const express = require('express');
const router = express.Router();
const vehiculoController = require('./controller/vehiculo.controller');
const { verifyToken } = require('../../utils/middleware/jwt');
const { requireRole } = require('../../utils/middleware/auth');

// Todas las rutas requieren autenticación
router.use(verifyToken);

/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     tags:
 *       - Vehículos
 *     summary: Obtiene todos los vehículos
 *     description: Retorna una lista de todos los vehículos disponibles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vehículos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vehiculos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vehiculo'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/vehiculos', requireRole(['admin', 'user']), vehiculoController.getVehiculos);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     tags:
 *       - Vehículos
 *     summary: Obtiene un vehículo por ID
 *     description: Retorna los detalles de un vehículo específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Vehículo encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vehiculo:
 *                   $ref: '#/components/schemas/Vehiculo'
 *       404:
 *         description: Vehículo no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/vehiculos/:id', requireRole(['admin', 'user']), vehiculoController.getVehiculoById);

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     tags:
 *       - Vehículos
 *     summary: Crea un nuevo vehículo
 *     description: Crea un nuevo vehículo con los datos proporcionados
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehiculo'
 *     responses:
 *       201:
 *         description: Vehículo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vehiculo:
 *                   $ref: '#/components/schemas/Vehiculo'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos
 *       500:
 *         description: Error del servidor
 */
router.post('/vehiculos', requireRole(['admin']), vehiculoController.createVehiculo);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     tags:
 *       - Vehículos
 *     summary: Actualiza un vehículo existente
 *     description: Actualiza los datos de un vehículo específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehiculo'
 *     responses:
 *       200:
 *         description: Vehículo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vehiculo:
 *                   $ref: '#/components/schemas/Vehiculo'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/vehiculos/:id', requireRole(['admin']), vehiculoController.updateVehiculo);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     tags:
 *       - Vehículos
 *     summary: Elimina un vehículo
 *     description: Elimina un vehículo específico de la base de datos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Vehículo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/vehiculos/:id', requireRole(['admin']), vehiculoController.deleteVehiculo);

module.exports = router; 