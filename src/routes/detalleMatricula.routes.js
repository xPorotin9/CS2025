const express = require('express');
const router = express.Router();
const detalleMatriculaController = require('../controllers/detalleMatricula.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Obtener todos los detalles de matrícula
router.get('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Detalles de Matrícula']
  // #swagger.summary = 'Obtener todos los detalles de matrícula'
  // #swagger.description = 'Obtiene la lista de todos los detalles de matrícula con opciones de filtrado'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['matriculaId'] = { in: 'query', description: 'ID de la matrícula para filtrar' }
  // #swagger.parameters['seccionId'] = { in: 'query', description: 'ID de la sección para filtrar' }
  // #swagger.parameters['estado'] = { in: 'query', description: 'Estado del detalle para filtrar (activo, retirado)' }
  /* #swagger.responses[200] = {
        description: 'Lista de detalles de matrícula obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    matriculaId: 1,
                    seccionId: 1,
                    estado: 'activo',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    matricula: {
                        id: 1,
                        alumnoId: 1,
                        periodoAcademicoId: 1,
                        fechaMatricula: '2023-01-01T00:00:00.000Z',
                        estado: 'pendiente'
                    },
                    seccion: {
                        id: 1,
                        nombre: 'A',
                        curso: {
                            id: 1,
                            nombre: 'Cálculo I',
                            codigo: 'MAT101',
                            ciclo: 1,
                            creditos: 4
                        }
                    }
                },
                {
                    id: 2,
                    matriculaId: 1,
                    seccionId: 2,
                    estado: 'activo',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    matricula: {
                        id: 1,
                        alumnoId: 1,
                        periodoAcademicoId: 1,
                        fechaMatricula: '2023-01-01T00:00:00.000Z',
                        estado: 'pendiente'
                    },
                    seccion: {
                        id: 2,
                        nombre: 'B',
                        curso: {
                            id: 2,
                            nombre: 'Física I',
                            codigo: 'FIS101',
                            ciclo: 1,
                            creditos: 4
                        }
                    }
                }
            ]
        }
   } */
  detalleMatriculaController.getAllDetallesMatricula(req, res);
});

// Obtener detalles de matrícula por matrícula
router.get('/matricula/:matriculaId', verifyToken, (req, res) => {
  // #swagger.tags = ['Detalles de Matrícula']
  // #swagger.summary = 'Obtener detalles de matrícula por matrícula'
  // #swagger.description = 'Obtiene todos los detalles que pertenecen a una matrícula específica'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['matriculaId'] = { description: 'ID de la matrícula' }
  /* #swagger.responses[200] = {
        description: 'Lista de detalles de matrícula por matrícula obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    matriculaId: 1,
                    seccionId: 1,
                    estado: 'activo',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    seccion: {
                        id: 1,
                        nombre: 'A',
                        curso: {
                            id: 1,
                            nombre: 'Cálculo I',
                            codigo: 'MAT101',
                            ciclo: 1,
                            creditos: 4
                        }
                    }
                },
                {
                    id: 2,
                    matriculaId: 1,
                    seccionId: 2,
                    estado: 'activo',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    seccion: {
                        id: 2,
                        nombre: 'B',
                        curso: {
                            id: 2,
                            nombre: 'Física I',
                            codigo: 'FIS101',
                            ciclo: 1,
                            creditos: 4
                        }
                    }
                }
            ]
        }
   } */
  detalleMatriculaController.getDetallesMatriculaByMatricula(req, res);
});

// Obtener un detalle de matrícula por ID
router.get('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Detalles de Matrícula']
  // #swagger.summary = 'Obtener un detalle de matrícula por ID'
  // #swagger.description = 'Obtiene los detalles de un detalle de matrícula específico'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del detalle de matrícula' }
  /* #swagger.responses[200] = {
        description: 'Detalle de matrícula obtenido exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                matriculaId: 1,
                seccionId: 1,
                estado: 'activo',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                matricula: {
                    id: 1,
                    alumnoId: 1,
                    periodoAcademicoId: 1,
                    fechaMatricula: '2023-01-01T00:00:00.000Z',
                    estado: 'pendiente'
                },
                seccion: {
                    id: 1,
                    nombre: 'A',
                    curso: {
                        id: 1,
                        nombre: 'Cálculo I',
                        codigo: 'MAT101',
                        ciclo: 1,
                        creditos: 4
                    }
                }
            }
        }
   } */
  detalleMatriculaController.getDetalleMatriculaById(req, res);
});

// Añadir un detalle de matrícula (añadir un curso a una matrícula existente)
router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Detalles de Matrícula']
  // #swagger.summary = 'Añadir un detalle de matrícula'
  // #swagger.description = 'Añade un curso (sección) a una matrícula existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del detalle de matrícula',
        required: true,
        schema: {
            matriculaId: 1,
            seccionId: 3
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Detalle de matrícula creado exitosamente',
        schema: {
            success: true,
            message: 'Detalle de matrícula creado exitosamente',
            data: {
                id: 3,
                matriculaId: 1,
                seccionId: 3,
                estado: 'activo',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                matricula: {
                    id: 1,
                    alumnoId: 1,
                    creditosInscritos: 12,
                    montoTotal: 1200
                },
                seccion: {
                    id: 3,
                    nombre: 'A',
                    curso: {
                        id: 3,
                        nombre: 'Programación I',
                        codigo: 'PROG101',
                        ciclo: 1,
                        creditos: 4
                    }
                }
            }
        }
   } */
  detalleMatriculaController.addDetalleMatricula(req, res);
});

// Retirar un curso (cambiar estado de un detalle de matrícula)
router.patch('/:id/retirar', verifyToken, (req, res) => {
  // #swagger.tags = ['Detalles de Matrícula']
  // #swagger.summary = 'Retirar un curso'
  // #swagger.description = 'Cambia el estado de un detalle de matrícula a "retirado" y libera el cupo en la sección'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del detalle de matrícula' }
  /* #swagger.responses[200] = {
        description: 'Curso retirado exitosamente',
        schema: {
            success: true,
            message: 'Curso retirado exitosamente',
            data: {
                id: 1,
                estado: 'retirado'
            }
        }
   } */
  detalleMatriculaController.retirarCurso(req, res);
});

module.exports = router;