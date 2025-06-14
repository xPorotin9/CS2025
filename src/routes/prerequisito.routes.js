const express = require('express');
const router = express.Router();
const prerequisitoController = require('../controllers/prerequisito.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Crear un nuevo prerequisito
router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Prerequisitos']
  // #swagger.summary = 'Crear un nuevo prerequisito'
  // #swagger.description = 'Crea una relación de prerequisito entre dos cursos'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del prerequisito',
        required: true,
        schema: {
            cursoId: 2,
            prerequisitoId: 1,
            tipoRequisito: 'obligatorio'
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Prerequisito creado exitosamente',
        schema: {
            success: true,
            message: 'Prerequisito creado exitosamente',
            data: {
                id: 1,
                cursoId: 2,
                prerequisitoId: 1,
                tipoRequisito: 'obligatorio',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  prerequisitoController.createPrerequisito(req, res);
});

// Obtener todos los prerequisitos
router.get('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Prerequisitos']
  // #swagger.summary = 'Obtener todos los prerequisitos'
  // #swagger.description = 'Obtiene la lista de todas las relaciones de prerequisitos'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.responses[200] = {
        description: 'Lista de prerequisitos obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    cursoId: 2,
                    prerequisitoId: 1,
                    tipoRequisito: 'obligatorio',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    curso: {
                        id: 2,
                        nombre: 'Cálculo II',
                        codigo: 'MAT102',
                        ciclo: 2
                    },
                    cursoPrerequisito: {
                        id: 1,
                        nombre: 'Cálculo I',
                        codigo: 'MAT101',
                        ciclo: 1
                    }
                },
                {
                    id: 2,
                    cursoId: 3,
                    prerequisitoId: 1,
                    tipoRequisito: 'obligatorio',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    curso: {
                        id: 3,
                        nombre: 'Ecuaciones Diferenciales',
                        codigo: 'MAT201',
                        ciclo: 3
                    },
                    cursoPrerequisito: {
                        id: 1,
                        nombre: 'Cálculo I',
                        codigo: 'MAT101',
                        ciclo: 1
                    }
                }
            ]
        }
   } */
  prerequisitoController.getAllPrerequisitos(req, res);
});

// Obtener prerequisitos por curso
router.get('/curso/:cursoId', verifyToken, (req, res) => {
  // #swagger.tags = ['Prerequisitos']
  // #swagger.summary = 'Obtener prerequisitos por curso'
  // #swagger.description = 'Obtiene todos los prerequisitos requeridos para un curso específico'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['cursoId'] = { description: 'ID del curso' }
  /* #swagger.responses[200] = {
        description: 'Lista de prerequisitos por curso obtenida exitosamente',
        schema: {
            success: true,
            count: 1,
            data: [
                {
                    id: 1,
                    cursoId: 2,
                    prerequisitoId: 1,
                    tipoRequisito: 'obligatorio',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    cursoPrerequisito: {
                        id: 1,
                        nombre: 'Cálculo I',
                        codigo: 'MAT101',
                        ciclo: 1,
                        creditos: 4
                    }
                }
            ]
        }
   } */
  prerequisitoController.getPrerequisitoByCurso(req, res);
});

// Obtener cursos que tienen como prerequisito a un curso específico
router.get('/prerequisito/:prerequisitoId', verifyToken, (req, res) => {
  // #swagger.tags = ['Prerequisitos']
  // #swagger.summary = 'Obtener cursos que tienen como prerequisito a un curso específico'
  // #swagger.description = 'Obtiene todos los cursos que tienen como prerequisito a un curso específico'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['prerequisitoId'] = { description: 'ID del curso prerequisito' }
  /* #swagger.responses[200] = {
        description: 'Lista de cursos por prerequisito obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    cursoId: 2,
                    prerequisitoId: 1,
                    tipoRequisito: 'obligatorio',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    curso: {
                        id: 2,
                        nombre: 'Cálculo II',
                        codigo: 'MAT102',
                        ciclo: 2,
                        creditos: 4
                    }
                },
                {
                    id: 2,
                    cursoId: 3,
                    prerequisitoId: 1,
                    tipoRequisito: 'obligatorio',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    curso: {
                        id: 3,
                        nombre: 'Ecuaciones Diferenciales',
                        codigo: 'MAT201',
                        ciclo: 3,
                        creditos: 4
                    }
                }
            ]
        }
   } */
  prerequisitoController.getCursosByPrerequisito(req, res);
});

// Actualizar un prerequisito
router.put('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Prerequisitos']
  // #swagger.summary = 'Actualizar un prerequisito'
  // #swagger.description = 'Actualiza los datos de un prerequisito existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del prerequisito' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos a actualizar',
        required: true,
        schema: {
            tipoRequisito: 'opcional'
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Prerequisito actualizado exitosamente',
        schema: {
            success: true,
            message: 'Prerequisito actualizado exitosamente',
            data: {
                id: 1,
                cursoId: 2,
                prerequisitoId: 1,
                tipoRequisito: 'opcional',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  prerequisitoController.updatePrerequisito(req, res);
});

// Eliminar un prerequisito
router.delete('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Prerequisitos']
  // #swagger.summary = 'Eliminar un prerequisito'
  // #swagger.description = 'Elimina una relación de prerequisito existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del prerequisito' }
  /* #swagger.responses[200] = {
        description: 'Prerequisito eliminado exitosamente',
        schema: {
            success: true,
            message: 'Prerequisito eliminado exitosamente'
        }
   } */
  prerequisitoController.deletePrerequisito(req, res);
});

module.exports = router;