const express = require('express');
const router = express.Router();
const EquipoController = require('./controller/equipo.controller');
const { requireAuth, requireRole } = require('../../utils/middleware/auth');

/**
 * @swagger
 * /api/equipos:
 *   get:
 *     summary: Obtiene todos los equipos
 *     tags: [Equipos]
 *     responses:
 *       200:
 *         description: Lista de equipos obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/equipos', EquipoController.getEquipos);

/**
 * @swagger
 * /api/equipos/{id}:
 *   get:
 *     summary: Obtiene un equipo por su ID
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Equipo encontrado exitosamente
 *       404:
 *         description: Equipo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/equipos/:id', EquipoController.getEquipoById);

/**
 * @swagger
 * /api/equipos:
 *   post:
 *     summary: Crea un nuevo equipo
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - nombre
 *               - pais
 *               - motor
 *               - imagen
 *               - fecha_fundacion
 *               - sede
 *               - descripcion
 *               - director
 *               - presupuesto
 *     responses:
 *       201:
 *         description: Equipo creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/equipos', requireAuth, requireRole(['admin']), EquipoController.createEquipo);

/**
 * @swagger
 * /api/equipos/{id}:
 *   put:
 *     summary: Actualiza un equipo existente
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Equipo actualizado exitosamente
 *       404:
 *         description: Equipo no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/equipos/:id', requireAuth, requireRole(['admin']), EquipoController.updateEquipo);

/**
 * @swagger
 * /api/equipos/{id}:
 *   delete:
 *     summary: Elimina un equipo
 *     tags: [Equipos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Equipo eliminado exitosamente
 *       404:
 *         description: Equipo no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/equipos/:id', requireAuth, requireRole(['admin']), EquipoController.deleteEquipo);

module.exports = router; 