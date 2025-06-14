const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horario.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Crear un nuevo horario
router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Horarios']
  // #swagger.summary = 'Crear un nuevo horario'
  // #swagger.description = 'Crea un nuevo horario para una sección'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del horario',
        required: true,
        schema: {
            seccionId: 1,
            dia: 'lunes',
            horaInicio: '08:00:00',
            horaFin: '10:00:00',
            tipo: 'teoria',
            aula: 'A-101'
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Horario creado exitosamente',
        schema: {
            success: true,
            message: 'Horario creado exitosamente',
            data: {
                id: 1,
                seccionId: 1,
                dia: 'lunes',
                horaInicio: '08:00:00',
                horaFin: '10:00:00',
                tipo: 'teoria',
                aula: 'A-101',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  horarioController.createHorario(req, res);
});

// Obtener todos los horarios
router.get('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Horarios']
  // #swagger.summary = 'Obtener todos los horarios'
  // #swagger.description = 'Obtiene la lista de todos los horarios con opciones de filtrado'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['seccionId'] = { in: 'query', description: 'ID de la sección para filtrar' }
  // #swagger.parameters['dia'] = { in: 'query', description: 'Día de la semana para filtrar' }
  // #swagger.parameters['aula'] = { in: 'query', description: 'Aula para filtrar' }
  /* #swagger.responses[200] = {
        description: 'Lista de horarios obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    seccionId: 1,
                    dia: 'lunes',
                    horaInicio: '08:00:00',
                    horaFin: '10:00:00',
                    tipo: 'teoria',
                    aula: 'A-101',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    seccion: {
                        id: 1,
                        nombre: 'A',
                        curso: {
                            id: 1,
                            nombre: 'Cálculo I',
                            codigo: 'MAT101'
                        },
                        periodoAcademico: {
                            id: 1,
                            nombre: 'Semestre 2023-I',
                            codigo: '2023-1'
                        },
                        docente: {
                            id: 1,
                            codigo: 'DOC001'
                        }
                    }
                },
                {
                    id: 2,
                    seccionId: 2,
                    dia: 'martes',
                    horaInicio: '08:00:00',
                    horaFin: '10:00:00',
                    tipo: 'teoria',
                    aula: 'A-102',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    seccion: {
                        id: 2,
                        nombre: 'B',
                        curso: {
                            id: 1,
                            nombre: 'Cálculo I',
                            codigo: 'MAT101'
                        },
                        periodoAcademico: {
                            id: 1,
                            nombre: 'Semestre 2023-I',
                            codigo: '2023-1'
                        },
                        docente: {
                            id: 2,
                            codigo: 'DOC002'
                        }
                    }
                }
            ]
        }
   } */
  horarioController.getAllHorarios(req, res);
});

// Obtener horarios por sección
router.get('/seccion/:seccionId', verifyToken, (req, res) => {
  // #swagger.tags = ['Horarios']
  // #swagger.summary = 'Obtener horarios por sección'
  // #swagger.description = 'Obtiene todos los horarios que pertenecen a una sección específica'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['seccionId'] = { description: 'ID de la sección' }
  /* #swagger.responses[200] = {
        description: 'Lista de horarios por sección obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    seccionId: 1,
                    dia: 'lunes',
                    horaInicio: '08:00:00',
                    horaFin: '10:00:00',
                    tipo: 'teoria',
                    aula: 'A-101',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                },
                {
                    id: 3,
                    seccionId: 1,
                    dia: 'miércoles',
                    horaInicio: '08:00:00',
                    horaFin: '10:00:00',
                    tipo: 'practica',
                    aula: 'A-101',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                }
            ]
        }
   } */
  horarioController.getHorariosBySeccion(req, res);
});

// Obtener un horario por ID
router.get('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Horarios']
  // #swagger.summary = 'Obtener un horario por ID'
  // #swagger.description = 'Obtiene los detalles de un horario específico'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del horario' }
  /* #swagger.responses[200] = {
        description: 'Horario obtenido exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                seccionId: 1,
                dia: 'lunes',
                horaInicio: '08:00:00',
                horaFin: '10:00:00',
                tipo: 'teoria',
                aula: 'A-101',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                seccion: {
                    id: 1,
                    nombre: 'A',
                    curso: {
                        id: 1,
                        nombre: 'Cálculo I',
                        codigo: 'MAT101'
                    },
                    periodoAcademico: {
                        id: 1,
                        nombre: 'Semestre 2023-I',
                        codigo: '2023-1'
                    },
                    docente: {
                        id: 1,
                        codigo: 'DOC001'
                    }
                }
            }
        }
   } */
  horarioController.getHorarioById(req, res);
});

// Actualizar un horario
router.put('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Horarios']
  // #swagger.summary = 'Actualizar un horario'
  // #swagger.description = 'Actualiza los datos de un horario existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del horario' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos a actualizar',
        required: true,
        schema: {
            dia: 'martes',
            horaInicio: '10:00:00',
            horaFin: '12:00:00',
            tipo: 'teoria',
            aula: 'A-103'
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Horario actualizado exitosamente',
        schema: {
            success: true,
            message: 'Horario actualizado exitosamente',
            data: {
                id: 1,
                seccionId: 1,
                dia: 'martes',
                horaInicio: '10:00:00',
                horaFin: '12:00:00',
                tipo: 'teoria',
                aula: 'A-103',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  horarioController.updateHorario(req, res);
});

// Eliminar un horario
router.delete('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Horarios']
  // #swagger.summary = 'Eliminar un horario'
  // #swagger.description = 'Elimina un horario existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del horario' }
  /* #swagger.responses[200] = {
        description: 'Horario eliminado exitosamente',
        schema: {
            success: true,
            message: 'Horario eliminado exitosamente'
        }
   } */
  horarioController.deleteHorario(req, res);
});

module.exports = router;