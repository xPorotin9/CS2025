const express = require('express');
const router = express.Router();
const configuracionController = require('../controllers/configuracion.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Crear una nueva configuración
router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Configuraciones']
  // #swagger.summary = 'Crear una nueva configuración'
  // #swagger.description = 'Crea una nueva configuración del sistema'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos de la configuración',
        required: true,
        schema: {
            nombre: 'costo_credito',
            valor: '100',
            descripcion: 'Costo por crédito para matrícula regular',
            tipo: 'number'
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Configuración creada exitosamente',
        schema: {
            success: true,
            message: 'Configuración creada exitosamente',
            data: {
                id: 1,
                nombre: 'costo_credito',
                valor: '100',
                descripcion: 'Costo por crédito para matrícula regular',
                tipo: 'number',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  configuracionController.createConfiguracion(req, res);
});

// Obtener todas las configuraciones
router.get('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Configuraciones']
  // #swagger.summary = 'Obtener todas las configuraciones'
  // #swagger.description = 'Obtiene la lista de todas las configuraciones del sistema'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.responses[200] = {
        description: 'Lista de configuraciones obtenida exitosamente',
        schema: {
            success: true,
            count: 3,
            data: [
                {
                    id: 1,
                    nombre: 'costo_credito',
                    valor: '100',
                    descripcion: 'Costo por crédito para matrícula regular',
                    tipo: 'number',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                },
                {
                    id: 2,
                    nombre: 'costo_credito_extemporaneo',
                    valor: '120',
                    descripcion: 'Costo por crédito para matrícula extemporánea',
                    tipo: 'number',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                },
                {
                    id: 3,
                    nombre: 'max_creditos_por_ciclo',
                    valor: '22',
                    descripcion: 'Máximo de créditos que un alumno puede llevar por ciclo',
                    tipo: 'number',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                }
            ]
        }
   } */
  configuracionController.getAllConfiguraciones(req, res);
});

// Obtener una configuración por nombre
router.get('/:nombre', verifyToken, (req, res) => {
  // #swagger.tags = ['Configuraciones']
  // #swagger.summary = 'Obtener una configuración por nombre'
  // #swagger.description = 'Obtiene los detalles de una configuración específica por su nombre'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['nombre'] = { description: 'Nombre de la configuración' }
  /* #swagger.responses[200] = {
        description: 'Configuración obtenida exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                nombre: 'costo_credito',
                valor: '100',
                descripcion: 'Costo por crédito para matrícula regular',
                tipo: 'number',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                valorTipado: 100
            }
        }
   } */
  configuracionController.getConfiguracionByNombre(req, res);
});

// Actualizar una configuración
router.put('/:nombre', verifyToken, (req, res) => {
  // #swagger.tags = ['Configuraciones']
  // #swagger.summary = 'Actualizar una configuración'
  // #swagger.description = 'Actualiza los datos de una configuración existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['nombre'] = { description: 'Nombre de la configuración' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos a actualizar',
        required: true,
        schema: {
            valor: '120',
            descripcion: 'Costo actualizado por crédito para matrícula regular',
            tipo: 'number'
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Configuración actualizada exitosamente',
        schema: {
            success: true,
            message: 'Configuración actualizada exitosamente',
            data: {
                id: 1,
                nombre: 'costo_credito',
                valor: '120',
                descripcion: 'Costo actualizado por crédito para matrícula regular',
                tipo: 'number',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  configuracionController.updateConfiguracion(req, res);
});

// Eliminar una configuración
router.delete('/:nombre', verifyToken, (req, res) => {
  // #swagger.tags = ['Configuraciones']
  // #swagger.summary = 'Eliminar una configuración'
  // #swagger.description = 'Elimina una configuración existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['nombre'] = { description: 'Nombre de la configuración' }
  /* #swagger.responses[200] = {
        description: 'Configuración eliminada exitosamente',
        schema: {
            success: true,
            message: 'Configuración eliminada exitosamente'
        }
   } */
  configuracionController.deleteConfiguracion(req, res);
});

module.exports = router;