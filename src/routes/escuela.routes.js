const express = require('express');
const router = express.Router();
const escuelaController = require('../controllers/escuela.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Crear una nueva escuela
router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Escuelas']
  // #swagger.summary = 'Crear una nueva escuela'
  // #swagger.description = 'Crea una nueva escuela en el sistema'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos de la escuela',
        required: true,
        schema: {
            facultadId: 1,
            nombre: 'Escuela de Ingeniería de Sistemas',
            codigo: 'EIS',
            descripcion: 'Escuela de ingeniería de sistemas e informática'
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Escuela creada exitosamente',
        schema: {
            success: true,
            message: 'Escuela creada exitosamente',
            data: {
                id: 1,
                facultadId: 1,
                nombre: 'Escuela de Ingeniería de Sistemas',
                codigo: 'EIS',
                descripcion: 'Escuela de ingeniería de sistemas e informática',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  escuelaController.createEscuela(req, res);
});

// Obtener todas las escuelas
router.get('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Escuelas']
  // #swagger.summary = 'Obtener todas las escuelas'
  // #swagger.description = 'Obtiene la lista de todas las escuelas'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.responses[200] = {
        description: 'Lista de escuelas obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    facultadId: 1,
                    nombre: 'Escuela de Ingeniería de Sistemas',
                    codigo: 'EIS',
                    descripcion: 'Escuela de ingeniería de sistemas e informática',
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    facultad: {
                        id: 1,
                        nombre: 'Facultad de Ingeniería',
                        codigo: 'FING'
                    }
                },
                {
                    id: 2,
                    facultadId: 1,
                    nombre: 'Escuela de Ingeniería Civil',
                    codigo: 'EIC',
                    descripcion: 'Escuela de ingeniería civil y arquitectura',
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    facultad: {
                        id: 1,
                        nombre: 'Facultad de Ingeniería',
                        codigo: 'FING'
                    }
                }
            ]
        }
   } */
  escuelaController.getAllEscuelas(req, res);
});

// Obtener escuelas por facultad
router.get('/facultad/:facultadId', verifyToken, (req, res) => {
  // #swagger.tags = ['Escuelas']
  // #swagger.summary = 'Obtener escuelas por facultad'
  // #swagger.description = 'Obtiene todas las escuelas que pertenecen a una facultad específica'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['facultadId'] = { description: 'ID de la facultad' }
  /* #swagger.responses[200] = {
        description: 'Lista de escuelas por facultad obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    facultadId: 1,
                    nombre: 'Escuela de Ingeniería de Sistemas',
                    codigo: 'EIS',
                    descripcion: 'Escuela de ingeniería de sistemas e informática',
                    activo: true,
                    facultad: {
                        id: 1,
                        nombre: 'Facultad de Ingeniería',
                        codigo: 'FING'
                    }
                },
                {
                    id: 2,
                    facultadId: 1,
                    nombre: 'Escuela de Ingeniería Civil',
                    codigo: 'EIC',
                    descripcion: 'Escuela de ingeniería civil y arquitectura',
                    activo: true,
                    facultad: {
                        id: 1,
                        nombre: 'Facultad de Ingeniería',
                        codigo: 'FING'
                    }
                }
            ]
        }
   } */
  escuelaController.getEscuelasByFacultad(req, res);
});

// Obtener una escuela por ID
router.get('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Escuelas']
  // #swagger.summary = 'Obtener una escuela por ID'
  // #swagger.description = 'Obtiene los detalles de una escuela específica'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID de la escuela' }
  /* #swagger.responses[200] = {
        description: 'Escuela obtenida exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                facultadId: 1,
                nombre: 'Escuela de Ingeniería de Sistemas',
                codigo: 'EIS',
                descripcion: 'Escuela de ingeniería de sistemas e informática',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                facultad: {
                    id: 1,
                    nombre: 'Facultad de Ingeniería',
                    codigo: 'FING'
                }
            }
        }
   } */
  escuelaController.getEscuelaById(req, res);
});

// Actualizar una escuela
router.put('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Escuelas']
  // #swagger.summary = 'Actualizar una escuela'
  // #swagger.description = 'Actualiza los datos de una escuela existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID de la escuela' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos a actualizar',
        required: true,
        schema: {
            facultadId: 1,
            nombre: 'Escuela de Ingeniería de Sistemas Actualizada',
            codigo: 'EIS-ACT',
            descripcion: 'Escuela de ingeniería de sistemas e informática actualizada',
            activo: true
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Escuela actualizada exitosamente',
        schema: {
            success: true,
            message: 'Escuela actualizada exitosamente',
            data: {
                id: 1,
                facultadId: 1,
                nombre: 'Escuela de Ingeniería de Sistemas Actualizada',
                codigo: 'EIS-ACT',
                descripcion: 'Escuela de ingeniería de sistemas e informática actualizada',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  escuelaController.updateEscuela(req, res);
});

// Eliminar una escuela (desactivación lógica)
router.delete('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Escuelas']
  // #swagger.summary = 'Eliminar una escuela'
  // #swagger.description = 'Desactiva lógicamente una escuela existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID de la escuela' }
  /* #swagger.responses[200] = {
        description: 'Escuela eliminada exitosamente',
        schema: {
            success: true,
            message: 'Escuela desactivada exitosamente'
        }
   } */
  escuelaController.deleteEscuela(req, res);
});

module.exports = router;