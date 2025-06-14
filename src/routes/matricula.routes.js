const express = require('express');
const router = express.Router();
const matriculaController = require('../controllers/matricula.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Crear una nueva matrícula
router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Matrículas']
  // #swagger.summary = 'Crear una nueva matrícula'
  // #swagger.description = 'Crea una nueva matrícula para un alumno en un periodo académico'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos de la matrícula',
        required: true,
        schema: {
            alumnoId: 1,
            periodoAcademicoId: 1,
            tipoMatricula: 'regular',
            secciones: [
                { seccionId: 1 },
                { seccionId: 2 }
            ]
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Matrícula creada exitosamente',
        schema: {
            success: true,
            message: 'Matrícula creada exitosamente',
            data: {
                matricula: {
                    id: 1,
                    alumnoId: 1,
                    periodoAcademicoId: 1,
                    fechaMatricula: '2023-01-01T00:00:00.000Z',
                    tipoMatricula: 'regular',
                    montoTotal: 800,
                    creditosInscritos: 8,
                    estado: 'pendiente',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                },
                detallesMatricula: [
                    {
                        id: 1,
                        matriculaId: 1,
                        seccionId: 1,
                        estado: 'activo',
                        createdAt: '2023-01-01T00:00:00.000Z',
                        updatedAt: '2023-01-01T00:00:00.000Z'
                    },
                    {
                        id: 2,
                        matriculaId: 1,
                        seccionId: 2,
                        estado: 'activo',
                        createdAt: '2023-01-01T00:00:00.000Z',
                        updatedAt: '2023-01-01T00:00:00.000Z'
                    }
                ]
            }
        }
   } */
  matriculaController.createMatricula(req, res);
});

// Obtener todas las matrículas
router.get('/', verifyToken, (req, res) => {
// #swagger.tags = ['Matrículas']
  // #swagger.summary = 'Obtener todas las matrículas'
  // #swagger.description = 'Obtiene la lista de todas las matrículas con opciones de filtrado'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['periodoAcademicoId'] = { in: 'query', description: 'ID del periodo académico para filtrar' }
  // #swagger.parameters['alumnoId'] = { in: 'query', description: 'ID del alumno para filtrar' }
  // #swagger.parameters['estado'] = { in: 'query', description: 'Estado de la matrícula para filtrar (pendiente, pagado, anulado)' }
  /* #swagger.responses[200] = {
        description: 'Lista de matrículas obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    alumnoId: 1,
                    periodoAcademicoId: 1,
                    fechaMatricula: '2023-01-01T00:00:00.000Z',
                    tipoMatricula: 'regular',
                    montoTotal: 800,
                    creditosInscritos: 8,
                    estado: 'pendiente',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    alumno: {
                        id: 1,
                        codigo: 'ALU001',
                        dni: '12345679'
                    },
                    periodoAcademico: {
                        id: 1,
                        nombre: 'Semestre 2023-I',
                        codigo: '2023-1'
                    }
                },
                {
                    id: 2,
                    alumnoId: 2,
                    periodoAcademicoId: 1,
                    fechaMatricula: '2023-01-02T00:00:00.000Z',
                    tipoMatricula: 'regular',
                    montoTotal: 600,
                    creditosInscritos: 6,
                    estado: 'pagado',
                    createdAt: '2023-01-02T00:00:00.000Z',
                    updatedAt: '2023-01-02T00:00:00.000Z',
                    alumno: {
                        id: 2,
                        codigo: 'ALU002',
                        dni: '98765432'
                    },
                    periodoAcademico: {
                        id: 1,
                        nombre: 'Semestre 2023-I',
                        codigo: '2023-1'
                    }
                }
            ]
        }
   } */
  matriculaController.getAllMatriculas(req, res);
});

// Obtener matrículas por periodo académico
router.get('/periodo/:periodoAcademicoId', verifyToken, (req, res) => {
  // #swagger.tags = ['Matrículas']
  // #swagger.summary = 'Obtener matrículas por periodo académico'
  // #swagger.description = 'Obtiene todas las matrículas que pertenecen a un periodo académico específico'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['periodoAcademicoId'] = { description: 'ID del periodo académico' }
  /* #swagger.responses[200] = {
        description: 'Lista de matrículas por periodo académico obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    alumnoId: 1,
                    periodoAcademicoId: 1,
                    fechaMatricula: '2023-01-01T00:00:00.000Z',
                    tipoMatricula: 'regular',
                    montoTotal: 800,
                    creditosInscritos: 8,
                    estado: 'pendiente',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    alumno: {
                        id: 1,
                        codigo: 'ALU001',
                        dni: '12345679'
                    }
                },
                {
                    id: 2,
                    alumnoId: 2,
                    periodoAcademicoId: 1,
                    fechaMatricula: '2023-01-02T00:00:00.000Z',
                    tipoMatricula: 'regular',
                    montoTotal: 600,
                    creditosInscritos: 6,
                    estado: 'pagado',
                    createdAt: '2023-01-02T00:00:00.000Z',
                    updatedAt: '2023-01-02T00:00:00.000Z',
                    alumno: {
                        id: 2,
                        codigo: 'ALU002',
                        dni: '98765432'
                    }
                }
            ]
        }
   } */
  matriculaController.getMatriculasByPeriodoAcademico(req, res);
});

// Generar reporte de matrículas por periodo
router.get('/reporte/periodo/:periodoAcademicoId', verifyToken, (req, res) => {
  // #swagger.tags = ['Matrículas']
  // #swagger.summary = 'Generar reporte de matrículas por periodo'
  // #swagger.description = 'Genera un reporte estadístico de matrículas para un periodo académico específico'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['periodoAcademicoId'] = { description: 'ID del periodo académico' }
  /* #swagger.responses[200] = {
        description: 'Reporte de matrículas generado exitosamente',
        schema: {
            success: true,
            data: {
                periodoAcademico: {
                    id: 1,
                    nombre: 'Semestre 2023-I',
                    codigo: '2023-1'
                },
                estadisticas: {
                    totalMatriculas: 50,
                    matriculasPorEstado: [
                        { estado: 'pendiente', cantidad: 20 },
                        { estado: 'pagado', cantidad: 25 },
                        { estado: 'anulado', cantidad: 5 }
                    ],
                    matriculasPorTipo: [
                        { tipoMatricula: 'regular', cantidad: 45 },
                        { tipoMatricula: 'extemporanea', cantidad: 5 }
                    ],
                    cursosMasSolicitados: [
                        {
                            id: 1,
                            nombre: 'Cálculo I',
                            codigo: 'MAT101',
                            ciclo: 1,
                            matriculados: 40
                        },
                        {
                            id: 2,
                            nombre: 'Física I',
                            codigo: 'FIS101',
                            ciclo: 1,
                            matriculados: 38
                        }
                    ]
                }
            }
        }
   } */
  matriculaController.generarReporteMatriculas(req, res);
});

// Obtener una matrícula por ID
router.get('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Matrículas']
  // #swagger.summary = 'Obtener una matrícula por ID'
  // #swagger.description = 'Obtiene los detalles de una matrícula específica, incluyendo sus detalles'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID de la matrícula' }
  /* #swagger.responses[200] = {
        description: 'Matrícula obtenida exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                alumnoId: 1,
                periodoAcademicoId: 1,
                fechaMatricula: '2023-01-01T00:00:00.000Z',
                tipoMatricula: 'regular',
                montoTotal: 800,
                creditosInscritos: 8,
                estado: 'pendiente',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                alumno: {
                    id: 1,
                    codigo: 'ALU001',
                    dni: '12345679'
                },
                periodoAcademico: {
                    id: 1,
                    nombre: 'Semestre 2023-I',
                    codigo: '2023-1'
                },
                detallesMatricula: [
                    {
                        id: 1,
                        matriculaId: 1,
                        seccionId: 1,
                        estado: 'activo',
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
        }
   } */
  matriculaController.getMatriculaById(req, res);
});

// Actualizar el estado de una matrícula
router.patch('/:id/estado', verifyToken, (req, res) => {
  // #swagger.tags = ['Matrículas']
  // #swagger.summary = 'Actualizar el estado de una matrícula'
  // #swagger.description = 'Actualiza el estado de una matrícula existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID de la matrícula' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Nuevo estado',
        required: true,
        schema: {
            estado: 'pagado'
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Estado de matrícula actualizado exitosamente',
        schema: {
            success: true,
            message: 'Estado de matrícula actualizado exitosamente',
            data: {
                id: 1,
                alumnoId: 1,
                periodoAcademicoId: 1,
                fechaMatricula: '2023-01-01T00:00:00.000Z',
                tipoMatricula: 'regular',
                montoTotal: 800,
                creditosInscritos: 8,
                estado: 'pagado',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  matriculaController.updateMatriculaEstado(req, res);
});

// Anular una matrícula
router.patch('/:id/anular', verifyToken, (req, res) => {
  // #swagger.tags = ['Matrículas']
  // #swagger.summary = 'Anular una matrícula'
  // #swagger.description = 'Anula una matrícula existente y libera los cupos en las secciones'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID de la matrícula' }
  /* #swagger.responses[200] = {
        description: 'Matrícula anulada exitosamente',
        schema: {
            success: true,
            message: 'Matrícula anulada exitosamente'
        }
   } */
  matriculaController.anularMatricula(req, res);
});

module.exports = router;