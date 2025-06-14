const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación
 */

// Registrar un nuevo usuario
router.post('/register', (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Registrar un nuevo usuario'
  // #swagger.description = 'Registra un nuevo usuario en el sistema'
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del usuario',
        required: true,
        schema: {
            nombre: 'Juan',
            apellido: 'Pérez',
            email: 'juan.perez@example.com',
            password: 'password123',
            rol: 'admin'
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Usuario registrado exitosamente',
        schema: {
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                id: 1,
                nombre: 'Juan',
                apellido: 'Pérez',
                email: 'juan.perez@example.com',
                rol: 'admin',
                token: 'jwt-token'
            }
        }
   } */
  /* #swagger.responses[400] = {
        description: 'Datos inválidos o el correo ya está registrado',
        schema: {
            success: false,
            message: 'El correo electrónico ya está registrado'
        }
   } */
  authController.register(req, res);
});

// Iniciar sesión
router.post('/login', (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Iniciar sesión'
  // #swagger.description = 'Inicia sesión en el sistema'
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Credenciales de usuario',
        required: true,
        schema: {
            email: 'juan.perez@example.com',
            password: 'password123'
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Inicio de sesión exitoso',
        schema: {
            success: true,
            message: 'Inicio de sesión exitoso',
            data: {
                id: 1,
                nombre: 'Juan',
                apellido: 'Pérez',
                email: 'juan.perez@example.com',
                rol: 'admin',
                token: 'jwt-token'
            }
        }
   } */
  /* #swagger.responses[401] = {
        description: 'Credenciales inválidas',
        schema: {
            success: false,
            message: 'Contraseña incorrecta'
        }
   } */
  authController.login(req, res);
});

// Obtener perfil del usuario autenticado
router.get('/profile', verifyToken, (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Obtener perfil del usuario autenticado'
  // #swagger.description = 'Obtiene el perfil del usuario autenticado'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.responses[200] = {
        description: 'Perfil de usuario obtenido exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                nombre: 'Juan',
                apellido: 'Pérez',
                email: 'juan.perez@example.com',
                rol: 'admin',
                activo: true
            }
        }
   } */
  /* #swagger.responses[401] = {
        description: 'No autorizado - Token inválido o expirado',
        schema: {
            success: false,
            message: 'Token inválido o expirado'
        }
   } */
  authController.getProfile(req, res);
});

module.exports = router;