const express = require('express');
const router = express.Router();
const periodoAcademicoController = require('../controllers/periodoAcademico.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Crear un nuevo periodo académico
router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Periodos Académicos']
  // #swagger.summary = 'Crear un nuevo periodo académico'
  // #swagger.description = 'Crea un nuevo periodo académico en el sistema'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del periodo académico',
        required: true,
        schema: {
            nombre: 'Semestre 2023-I',
            codigo: '2023-1',
            fechaInicio: '2023-03-01',
            fechaFin: '2023-07-31',
            fechaInicioMatricula: '2023-02-01',
            fechaFinMatricula: '2023-02-15',
            fechaInicioMatriculaExtemporanea: '2023-02-16',
            fechaFinMatriculaExtemporanea: '2023-02-28',
            estado: 'programado'
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Periodo académico creado exitosamente',
        schema: {
            success: true,
            message: 'Periodo académico creado exitosamente',
            data: {
                id: 1,
                nombre: 'Semestre 2023-I',
                codigo: '2023-1',
                fechaInicio: '2023-03-01',
                fechaFin: '2023-07-31',
                fechaInicioMatricula: '2023-02-01',
                fechaFinMatricula: '2023-02-15',
                fechaInicioMatriculaExtemporanea: '2023-02-16',
                fechaFinMatriculaExtemporanea: '2023-02-28',
                estado: 'programado',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  periodoAcademicoController.createPeriodoAcademico(req, res);
});

// Obtener todos los periodos académicos
router.get('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Periodos Académicos']
  // #swagger.summary = 'Obtener todos los periodos académicos'
  // #swagger.description = 'Obtiene la lista de todos los periodos académicos con opciones de filtrado'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['estado'] = { in: 'query', description: 'Estado del periodo académico para filtrar (programado, en_curso, finalizado)' }
  // #swagger.parameters['activo'] = { in: 'query', description: 'Estado activo/inactivo para filtrar' }
  /* #swagger.responses[200] = {
        description: 'Lista de periodos académicos obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    nombre: 'Semestre 2023-I',
                    codigo: '2023-1',
                    fechaInicio: '2023-03-01',
                    fechaFin: '2023-07-31',
                    fechaInicioMatricula: '2023-02-01',
                    fechaFinMatricula: '2023-02-15',
                    fechaInicioMatriculaExtemporanea: '2023-02-16',
                    fechaFinMatriculaExtemporanea: '2023-02-28',
                    estado: 'programado',
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                },
                {
                    id: 2,
                    nombre: 'Semestre 2023-II',
                    codigo: '2023-2',
                    fechaInicio: '2023-08-01',
                    fechaFin: '2023-12-15',
                    fechaInicioMatricula: '2023-07-01',
                    fechaFinMatricula: '2023-07-15',
                    fechaInicioMatriculaExtemporanea: '2023-07-16',
                    fechaFinMatriculaExtemporanea: '2023-07-31',
                    estado: 'programado',
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                }
            ]
        }
   } */
  periodoAcademicoController.getAllPeriodosAcademicos(req, res);
});

// Obtener periodo académico actual
router.get('/actual', verifyToken, (req, res) => {
  // #swagger.tags = ['Periodos Académicos']
  // #swagger.summary = 'Obtener periodo académico actual'
  // #swagger.description = 'Obtiene el periodo académico actual o próximo a iniciar'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.responses[200] = {
        description: 'Periodo académico actual obtenido exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                nombre: 'Semestre 2023-I',
                codigo: '2023-1',
                fechaInicio: '2023-03-01',
                fechaFin: '2023-07-31',
                fechaInicioMatricula: '2023-02-01',
                fechaFinMatricula: '2023-02-15',
                fechaInicioMatriculaExtemporanea: '2023-02-16',
                fechaFinMatriculaExtemporanea: '2023-02-28',
                estado: 'en_curso',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  periodoAcademicoController.getPeriodoAcademicoActual(req, res);
});

// Obtener un periodo académico por ID
router.get('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Periodos Académicos']
  // #swagger.summary = 'Obtener un periodo académico por ID'
  // #swagger.description = 'Obtiene los detalles de un periodo académico específico'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del periodo académico' }
  /* #swagger.responses[200] = {
        description: 'Periodo académico obtenido exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                nombre: 'Semestre 2023-I',
                codigo: '2023-1',
                fechaInicio: '2023-03-01',
                fechaFin: '2023-07-31',
                fechaInicioMatricula: '2023-02-01',
                fechaFinMatricula: '2023-02-15',
                fechaInicioMatriculaExtemporanea: '2023-02-16',
                fechaFinMatriculaExtemporanea: '2023-02-28',
                estado: 'programado',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  periodoAcademicoController.getPeriodoAcademicoById(req, res);
});

// Actualizar un periodo académico
router.put('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Periodos Académicos']
  // #swagger.summary = 'Actualizar un periodo académico'
  // #swagger.description = 'Actualiza los datos de un periodo académico existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del periodo académico' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos a actualizar',
        required: true,
        schema: {
            nombre: 'Semestre 2023-I Actualizado',
            fechaInicio: '2023-03-15',
            fechaFin: '2023-08-15',
            fechaInicioMatricula: '2023-02-15',
            fechaFinMatricula: '2023-03-01',
            fechaInicioMatriculaExtemporanea: '2023-03-02',
            fechaFinMatriculaExtemporanea: '2023-03-14',
            estado: 'programado',
            activo: true
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Periodo académico actualizado exitosamente',
        schema: {
            success: true,
            message: 'Periodo académico actualizado exitosamente',
            data: {
                id: 1,
                nombre: 'Semestre 2023-I Actualizado',
                codigo: '2023-1',
                fechaInicio: '2023-03-15',
                fechaFin: '2023-08-15',
                fechaInicioMatricula: '2023-02-15',
                fechaFinMatricula: '2023-03-01',
                fechaInicioMatriculaExtemporanea: '2023-03-02',
                fechaFinMatriculaExtemporanea: '2023-03-14',
                estado: 'programado',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  periodoAcademicoController.updatePeriodoAcademico(req, res);
});

// Actualizar estado de un periodo académico
router.patch('/:id/estado', verifyToken, (req, res) => {
  // #swagger.tags = ['Periodos Académicos']
  // #swagger.summary = 'Actualizar estado de un periodo académico'
  // #swagger.description = 'Actualiza el estado de un periodo académico existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del periodo académico' }
/* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Nuevo estado',
        required: true,
        schema: {
            estado: 'en_curso'
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Estado de periodo académico actualizado exitosamente',
        schema: {
            success: true,
            message: 'Estado de periodo académico actualizado exitosamente',
            data: {
                id: 1,
                estado: 'en_curso'
            }
        }
   } */
  periodoAcademicoController.updatePeriodoAcademicoEstado(req, res);
});

module.exports = router;