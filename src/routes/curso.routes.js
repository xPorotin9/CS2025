const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/curso.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Crear un nuevo curso
router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Cursos']
  // #swagger.summary = 'Crear un nuevo curso'
  // #swagger.description = 'Crea un nuevo curso en el sistema'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del curso',
        required: true,
        schema: {
            planEstudioId: 1,
            codigo: 'MAT101',
            nombre: 'Cálculo I',
            descripcion: 'Fundamentos de cálculo diferencial e integral',
            ciclo: 1,
            creditos: 4,
            horasTeoricas: 3,
            horasPracticas: 2,
            tipo: 'obligatorio'
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Curso creado exitosamente',
        schema: {
            success: true,
            message: 'Curso creado exitosamente',
            data: {
                id: 1,
                planEstudioId: 1,
                codigo: 'MAT101',
                nombre: 'Cálculo I',
                descripcion: 'Fundamentos de cálculo diferencial e integral',
                ciclo: 1,
                creditos: 4,
                horasTeoricas: 3,
                horasPracticas: 2,
                tipo: 'obligatorio',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  cursoController.createCurso(req, res);
});

// Obtener todos los cursos
router.get('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Cursos']
  // #swagger.summary = 'Obtener todos los cursos'
  // #swagger.description = 'Obtiene la lista de todos los cursos con opciones de filtrado'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['planEstudioId'] = { in: 'query', description: 'ID del plan de estudio para filtrar' }
  // #swagger.parameters['ciclo'] = { in: 'query', description: 'Ciclo académico para filtrar' }
  // #swagger.parameters['activo'] = { in: 'query', description: 'Estado activo/inactivo para filtrar' }
  /* #swagger.responses[200] = {
        description: 'Lista de cursos obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    planEstudioId: 1,
                    codigo: 'MAT101',
                    nombre: 'Cálculo I',
                    descripcion: 'Fundamentos de cálculo diferencial e integral',
                    ciclo: 1,
                    creditos: 4,
                    horasTeoricas: 3,
                    horasPracticas: 2,
                    tipo: 'obligatorio',
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    planEstudio: {
                        id: 1,
                        nombre: 'Plan de Estudios 2023',
                        codigo: 'PE-2023'
                    }
                },
                {
                    id: 2,
                    planEstudioId: 1,
                    codigo: 'FIS101',
                    nombre: 'Física I',
                    descripcion: 'Fundamentos de física mecánica',
                    ciclo: 1,
                    creditos: 4,
                    horasTeoricas: 3,
                    horasPracticas: 2,
                    tipo: 'obligatorio',
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    planEstudio: {
                        id: 1,
                        nombre: 'Plan de Estudios 2023',
                        codigo: 'PE-2023'
                    }
                }
            ]
        }
   } */
  cursoController.getAllCursos(req, res);
});

// Obtener cursos por plan de estudio
router.get('/plan-estudio/:planEstudioId', verifyToken, (req, res) => {
  // #swagger.tags = ['Cursos']
  // #swagger.summary = 'Obtener cursos por plan de estudio'
  // #swagger.description = 'Obtiene todos los cursos que pertenecen a un plan de estudio específico'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['planEstudioId'] = { description: 'ID del plan de estudio' }
  // #swagger.parameters['ciclo'] = { in: 'query', description: 'Ciclo académico para filtrar' }
  /* #swagger.responses[200] = {
        description: 'Lista de cursos por plan de estudio obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    planEstudioId: 1,
                    codigo: 'MAT101',
                    nombre: 'Cálculo I',
                    descripcion: 'Fundamentos de cálculo diferencial e integral',
                    ciclo: 1,
                    creditos: 4,
                    horasTeoricas: 3,
                    horasPracticas: 2,
                    tipo: 'obligatorio',
                    activo: true
                },
                {
                    id: 2,
                    planEstudioId: 1,
                    codigo: 'FIS101',
                    nombre: 'Física I',
                    descripcion: 'Fundamentos de física mecánica',
                    ciclo: 1,
                    creditos: 4,
                    horasTeoricas: 3,
                    horasPracticas: 2,
                    tipo: 'obligatorio',
                    activo: true
                }
            ]
        }
   } */
  cursoController.getCursosByPlanEstudio(req, res);
});

// Obtener un curso por ID
router.get('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Cursos']
  // #swagger.summary = 'Obtener un curso por ID'
  // #swagger.description = 'Obtiene los detalles de un curso específico, incluyendo sus prerrequisitos'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del curso' }
  /* #swagger.responses[200] = {
        description: 'Curso obtenido exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                planEstudioId: 1,
                codigo: 'MAT101',
                nombre: 'Cálculo I',
                descripcion: 'Fundamentos de cálculo diferencial e integral',
                ciclo: 1,
                creditos: 4,
                horasTeoricas: 3,
                horasPracticas: 2,
                tipo: 'obligatorio',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                planEstudio: {
                    id: 1,
                    nombre: 'Plan de Estudios 2023',
                    codigo: 'PE-2023'
                },
                prerequisitosRequeridos: []
            }
        }
   } */
  cursoController.getCursoById(req, res);
});

// Actualizar un curso
router.put('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Cursos']
  // #swagger.summary = 'Actualizar un curso'
  // #swagger.description = 'Actualiza los datos de un curso existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del curso' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos a actualizar',
        required: true,
        schema: {
            nombre: 'Cálculo I Actualizado',
            descripcion: 'Fundamentos actualizados de cálculo diferencial e integral',
            ciclo: 1,
            creditos: 5,
            horasTeoricas: 3,
            horasPracticas: 4,
            tipo: 'obligatorio',
            activo: true
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Curso actualizado exitosamente',
        schema: {
            success: true,
            message: 'Curso actualizado exitosamente',
            data: {
                id: 1,
                planEstudioId: 1,
                codigo: 'MAT101',
                nombre: 'Cálculo I Actualizado',
                descripcion: 'Fundamentos actualizados de cálculo diferencial e integral',
                ciclo: 1,
                creditos: 5,
                horasTeoricas: 3,
                horasPracticas: 4,
                tipo: 'obligatorio',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  cursoController.updateCurso(req, res);
});

// Eliminar un curso (desactivación lógica)
router.delete('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Cursos']
  // #swagger.summary = 'Eliminar un curso'
  // #swagger.description = 'Desactiva lógicamente un curso existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del curso' }
  /* #swagger.responses[200] = {
        description: 'Curso eliminado exitosamente',
        schema: {
            success: true,
            message: 'Curso desactivado exitosamente'
        }
   } */
  cursoController.deleteCurso(req, res);
});

module.exports = router;