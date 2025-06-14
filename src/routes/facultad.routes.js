const express = require('express');
const router = express.Router();
const facultadController = require('../controllers/facultad.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Crear una nueva facultad
router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Facultades']
  // #swagger.summary = 'Crear una nueva facultad'
  // #swagger.description = 'Crea una nueva facultad en el sistema'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos de la facultad',
        required: true,
        schema: {
            nombre: 'Facultad de Ingeniería',
            codigo: 'FING',
            descripcion: 'Facultad de ingeniería y tecnología'
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Facultad creada exitosamente',
        schema: {
            success: true,
            message: 'Facultad creada exitosamente',
            data: {
                id: 1,
                nombre: 'Facultad de Ingeniería',
                codigo: 'FING',
                descripcion: 'Facultad de ingeniería y tecnología',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  /* #swagger.responses[400] = {
        description: 'Datos inválidos o código ya existente',
        schema: {
            success: false,
            message: 'Ya existe una facultad con este código'
        }
   } */
  facultadController.createFacultad(req, res);
});

// Obtener todas las facultades
router.get('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Facultades']
  // #swagger.summary = 'Obtener todas las facultades'
  // #swagger.description = 'Obtiene la lista de todas las facultades'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.responses[200] = {
        description: 'Lista de facultades obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    nombre: 'Facultad de Ingeniería',
                    codigo: 'FING',
                    descripcion: 'Facultad de ingeniería y tecnología',
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                },
                {
                    id: 2,
                    nombre: 'Facultad de Ciencias',
                    codigo: 'FCIEN',
                    descripcion: 'Facultad de ciencias exactas y naturales',
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                }
            ]
        }
   } */
  facultadController.getAllFacultades(req, res);
});

// Obtener una facultad por ID
router.get('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Facultades']
  // #swagger.summary = 'Obtener una facultad por ID'
  // #swagger.description = 'Obtiene los detalles de una facultad específica'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID de la facultad' }
  /* #swagger.responses[200] = {
        description: 'Facultad obtenida exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                nombre: 'Facultad de Ingeniería',
                codigo: 'FING',
                descripcion: 'Facultad de ingeniería y tecnología',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  /* #swagger.responses[404] = {
        description: 'Facultad no encontrada',
        schema: {
            success: false,
            message: 'Facultad no encontrada'
        }
   } */
  facultadController.getFacultadById(req, res);
});

// Actualizar una facultad
router.put('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Facultades']
  // #swagger.summary = 'Actualizar una facultad'
  // #swagger.description = 'Actualiza los datos de una facultad existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID de la facultad' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos a actualizar',
        required: true,
        schema: {
            nombre: 'Facultad de Ingeniería Actualizada',
            codigo: 'FING-ACT',
            descripcion: 'Facultad de ingeniería y tecnología actualizada',
            activo: true
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Facultad actualizada exitosamente',
        schema: {
            success: true,
            message: 'Facultad actualizada exitosamente',
            data: {
                id: 1,
                nombre: 'Facultad de Ingeniería Actualizada',
                codigo: 'FING-ACT',
                descripcion: 'Facultad de ingeniería y tecnología actualizada',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  /* #swagger.responses[404] = {
        description: 'Facultad no encontrada',
        schema: {
            success: false,
            message: 'Facultad no encontrada'
        }
   } */
  facultadController.updateFacultad(req, res);
});

// Eliminar una facultad (desactivación lógica)
router.delete('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Facultades']
  // #swagger.summary = 'Eliminar una facultad'
  // #swagger.description = 'Desactiva lógicamente una facultad existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID de la facultad' }
  /* #swagger.responses[200] = {
        description: 'Facultad eliminada exitosamente',
        schema: {
            success: true,
            message: 'Facultad desactivada exitosamente'
        }
   } */
  /* #swagger.responses[404] = {
        description: 'Facultad no encontrada',
        schema: {
            success: false,
            message: 'Facultad no encontrada'
        }
   } */
  facultadController.deleteFacultad(req, res);
});

module.exports = router;