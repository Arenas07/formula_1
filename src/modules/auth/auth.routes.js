const express = require('express');
const router = express.Router();
const authController = require('./controller/auth.controller');
const { verifyToken } = require('../../utils/middleware/jwt');
const { validateLogin, validateRegister, validateResults } = require('./scream/auth.scream');

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para la gestión de autenticación de usuarios
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     rol:
 *                       type: string
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', validateLogin, validateResults, authController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               rol:
 *                 type: string
 *                 enum: [usuario, admin]
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Email ya registrado
 */
router.post('/register', validateRegister, validateResults, authController.register);

/**
 * @swagger
 * /auth/register-admin:
 *   post:
 *     summary: Registrar nuevo administrador
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del administrador
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del administrador
 *               name:
 *                 type: string
 *                 description: Nombre completo del administrador
 *     responses:
 *       201:
 *         description: Administrador registrado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 */
router.post('/register-admin', validateRegister, validateResults, authController.registerAdmin);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *       401:
 *         description: No autorizado
 */
router.post('/logout', verifyToken, authController.logout);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Obtener perfil del usuario
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/profile', verifyToken, authController.getProfile);

/**
 * @swagger
 * /auth/me/role:
 *   get:
 *     summary: Obtener el rol del usuario
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rol del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/role', verifyToken, authController.getCurrentUserRole);

module.exports = router; 