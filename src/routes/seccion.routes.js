const express = require('express');
const router = express.Router();
const seccionController = require('../controllers/seccion.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Crear una nueva sección
router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Secciones']
  // #swagger.summary = 'Crear una nueva sección'
  // #swagger.description = 'Crea una nueva sección en el sistema'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos de la sección',
        required: true,
        schema: {
            cursoId: 1,
            periodoAcademicoId: 1,
            docenteId: 1,
            nombre: 'A',
            capacidadMaxima: 40
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Sección creada exitosamente',
        schema: {
            success: true,
            message: 'Sección creada exitosamente',
            data: {
                id: 1,
                cursoId: 1,
                periodoAcademicoId: 1,
                docenteId: 1,
                nombre: 'A',
                capacidadMaxima: 40,
                capacidadActual: 0,
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  seccionController.createSeccion(req, res);
});

// Obtener todas las secciones
router.get('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Secciones']
  // #swagger.summary = 'Obtener todas las secciones'
  // #swagger.description = 'Obtiene la lista de todas las secciones con opciones de filtrado'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['cursoId'] = { in: 'query', description: 'ID del curso para filtrar' }
  // #swagger.parameters['periodoAcademicoId'] = { in: 'query', description: 'ID del periodo académico para filtrar' }
  // #swagger.parameters['docenteId'] = { in: 'query', description: 'ID del docente para filtrar' }
  // #swagger.parameters['activo'] = { in: 'query', description: 'Estado activo/inactivo para filtrar' }
  /* #swagger.responses[200] = {
        description: 'Lista de secciones obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    cursoId: 1,
                    periodoAcademicoId: 1,
                    docenteId: 1,
                    nombre: 'A',
                    capacidadMaxima: 40,
                    capacidadActual: 0,
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    curso: {
                        id: 1,
                        nombre: 'Cálculo I',
                        codigo: 'MAT101',
                        ciclo: 1,
                        creditos: 4
                    },
                    periodoAcademico: {
                        id: 1,
                        nombre: 'Semestre 2023-I',
                        codigo: '2023-1'
                    },
                    docente: {
                        id: 1,
                        codigo: 'DOC001',
                        especialidad: 'Desarrollo de Software',
                        usuario: {
                            nombre: 'Juan',
                            apellido: 'Pérez'
                        }
                    }
                },
                {
                    id: 2,
                    cursoId: 1,
                    periodoAcademicoId: 1,
                    docenteId: 2,
                    nombre: 'B',
                    capacidadMaxima: 40,
                    capacidadActual: 0,
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    curso: {
                        id: 1,
                        nombre: 'Cálculo I',
                        codigo: 'MAT101',
                        ciclo: 1,
                        creditos: 4
                    },
                    periodoAcademico: {
                        id: 1,
                        nombre: 'Semestre 2023-I',
                        codigo: '2023-1'
                    },
                    docente: {
                        id: 2,
                        codigo: 'DOC002',
                        especialidad: 'Base de Datos',
                        usuario: {
                            nombre: 'Ana',
                            apellido: 'Gómez'
                        }
                    }
                }
            ]
        }
   } */
  seccionController.getAllSecciones(req, res);
});

// Obtener secciones por periodo académico
router.get('/periodo/:periodoAcademicoId', verifyToken, (req, res) => {
  // #swagger.tags = ['Secciones']
  // #swagger.summary = 'Obtener secciones por periodo académico'
  // #swagger.description = 'Obtiene todas las secciones que pertenecen a un periodo académico específico'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['periodoAcademicoId'] = { description: 'ID del periodo académico' }
  /* #swagger.responses[200] = {
        description: 'Lista de secciones por periodo académico obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    cursoId: 1,
                    periodoAcademicoId: 1,
                    docenteId: 1,
                    nombre: 'A',
                    capacidadMaxima: 40,
                    capacidadActual: 0,
                    activo: true,
                    curso: {
                        id: 1,
                        nombre: 'Cálculo I',
                        codigo: 'MAT101',
                        ciclo: 1,
                        creditos: 4
                    },
                    docente: {
                        id: 1,
                        codigo: 'DOC001',
                        usuario: {
                            nombre: 'Juan',
                            apellido: 'Pérez'
                        }
                    }
                },
                {
                    id: 2,
                    cursoId: 1,
                    periodoAcademicoId: 1,
                    docenteId: 2,
                    nombre: 'B',
                    capacidadMaxima: 40,
                    capacidadActual: 0,
                    activo: true,
                    curso: {
                        id: 1,
                        nombre: 'Cálculo I',
                        codigo: 'MAT101',
                        ciclo: 1,
                        creditos: 4
                    },
                    docente: {
                        id: 2,
                        codigo: 'DOC002',
                        usuario: {
                            nombre: 'Ana',
                            apellido: 'Gómez'
                        }
                    }
                }
            ]
        }
   } */
  seccionController.getSeccionesByPeriodoAcademico(req, res);
});

// Obtener secciones por curso y periodo académico
router.get('/curso/:cursoId/periodo/:periodoAcademicoId', verifyToken, (req, res) => {
  // #swagger.tags = ['Secciones']
  // #swagger.summary = 'Obtener secciones por curso y periodo académico'
  // #swagger.description = 'Obtiene todas las secciones que pertenecen a un curso y periodo académico específicos'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['cursoId'] = { description: 'ID del curso' }
  // #swagger.parameters['periodoAcademicoId'] = { description: 'ID del periodo académico' }
  /* #swagger.responses[200] = {
        description: 'Lista de secciones por curso y periodo académico obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    cursoId: 1,
                    periodoAcademicoId: 1,
                    docenteId: 1,
                    nombre: 'A',
                    capacidadMaxima: 40,
                    capacidadActual: 0,
                    activo: true,
                    docente: {
                        id: 1,
                        codigo: 'DOC001',
                        usuario: {
                            nombre: 'Juan',
                            apellido: 'Pérez'
                        }
                    },
                    horarios: [
                        {
                            id: 1,
                            seccionId: 1,
                            dia: 'lunes',
                            horaInicio: '08:00:00',
                            horaFin: '10:00:00',
                            tipo: 'teoria',
                            aula: 'A-101'
                        }
                    ]
                },
                {
                    id: 2,
                    cursoId: 1,
                    periodoAcademicoId: 1,
                    docenteId: 2,
                    nombre: 'B',
                    capacidadMaxima: 40,
                    capacidadActual: 0,
                    activo: true,
                    docente: {
                        id: 2,
                        codigo: 'DOC002',
                        usuario: {
                            nombre: 'Ana',
                            apellido: 'Gómez'
                        }
                    },
                    horarios: [
                        {
                            id: 2,
                            seccionId: 2,
                            dia: 'martes',
                            horaInicio: '08:00:00',
                            horaFin: '10:00:00',
                            tipo: 'teoria',
                            aula: 'A-102'
                        }
                    ]
                }
            ]
        }
   } */
  seccionController.getSeccionesByCursoAndPeriodo(req, res);
});

// Obtener una sección por ID
router.get('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Secciones']
  // #swagger.summary = 'Obtener una sección por ID'
  // #swagger.description = 'Obtiene los detalles de una sección específica, incluyendo sus horarios'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID de la sección' }
  /* #swagger.responses[200] = {
        description: 'Sección obtenida exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                cursoId: 1,
                periodoAcademicoId: 1,
                docenteId: 1,
                nombre: 'A',
                capacidadMaxima: 40,
                capacidadActual: 0,
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                curso: {
                    id: 1,
                    nombre: 'Cálculo I',
                    codigo: 'MAT101',
                    ciclo: 1,
                    creditos: 4,
                    horasTeoricas: 3,
                    horasPracticas: 2
                },
                periodoAcademico: {
                    id: 1,
                    nombre: 'Semestre 2023-I',
                    codigo: '2023-1',
                    fechaInicio: '2023-03-01',
                    fechaFin: '2023-07-31'
                },
                docente: {
                    id: 1,
                    codigo: 'DOC001',
                    especialidad: 'Desarrollo de Software',
                    gradoAcademico: 'doctor',
                    usuario: {
                        nombre: 'Juan',
                        apellido: 'Pérez',
                        email: 'juan.perez@universidad.edu'
                    }
                },
                horarios: [
                    {
                        id: 1,
                        seccionId: 1,
                        dia: 'lunes',
                        horaInicio: '08:00:00',
                        horaFin: '10:00:00',
                        tipo: 'teoria',
                        aula: 'A-101'
                    },
                    {
                        id: 3,
                        seccionId: 1,
                        dia: 'miércoles',
                        horaInicio: '08:00:00',
                        horaFin: '10:00:00',
                        tipo: 'practica',
                        aula: 'A-101'
                    }
                ]
            }
        }
   } */
  seccionController.getSeccionById(req, res);
});

// Actualizar una sección
router.put('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Secciones']
  // #swagger.summary = 'Actualizar una sección'
  // #swagger.description = 'Actualiza los datos de una sección existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID de la sección' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos a actualizar',
        required: true,
        schema: {
            docenteId: 2,
            nombre: 'A1',
            capacidadMaxima: 45,
            activo: true
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Sección actualizada exitosamente',
        schema: {
            success: true,
            message: 'Sección actualizada exitosamente',
            data: {
                id: 1,
                cursoId: 1,
                periodoAcademicoId: 1,
                docenteId: 2,
                nombre: 'A1',
                capacidadMaxima: 45,
                capacidadActual: 0,
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  seccionController.updateSeccion(req, res);
});

// Eliminar una sección (lógicamente)
router.delete('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Secciones']
  // #swagger.summary = 'Eliminar una sección'
  // #swagger.description = 'Desactiva lógicamente una sección existente y elimina sus horarios'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID de la sección' }
  /* #swagger.responses[200] = {
        description: 'Sección eliminada exitosamente',
        schema: {
            success: true,
            message: 'Sección eliminada exitosamente'
        }
   } */
  seccionController.deleteSeccion(req, res);
});

module.exports = router;