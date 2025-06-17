const express = require('express');
const router = express.Router();
const areaController = require('../controllers/area.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Áreas']
  // #swagger.summary = 'Crear una nueva área'
  // #swagger.description = 'Crea una nueva área en el sistema'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del área',
        required: true,
        schema: {
            codigo: 'EE',
            nombre: 'Estudios de Especialidad',
            descripcion: 'Cursos de especialidad de la carrera'
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Área creada exitosamente',
        schema: {
            success: true,
            message: 'Área creada exitosamente',
            data: {
                id: 1,
                codigo: 'EE',
                nombre: 'Estudios de Especialidad',
                descripcion: 'Cursos de especialidad de la carrera',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  areaController.createArea(req, res);
});

// Obtener todas las áreas
router.get('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Áreas']
  // #swagger.summary = 'Obtener todas las áreas'
  // #swagger.description = 'Obtiene la lista de todas las áreas con opciones de filtrado'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['activo'] = { in: 'query', description: 'Estado activo/inactivo para filtrar' }
  /* #swagger.responses[200] = {
        description: 'Lista de áreas obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    codigo: 'EE',
                    nombre: 'Estudios de Especialidad',
                    descripcion: 'Cursos de especialidad de la carrera',
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    cursos: []
                },
                {
                    id: 2,
                    codigo: 'EG',
                    nombre: 'Estudios Generales',
                    descripcion: 'Cursos de formación general',
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    cursos: []
                }
            ]
        }
   } */
  areaController.getAllAreas(req, res);
});

// Obtener un área por ID
router.get('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Áreas']
  // #swagger.summary = 'Obtener un área por ID'
  // #swagger.description = 'Obtiene los detalles de un área específica'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del área' }
  /* #swagger.responses[200] = {
        description: 'Área obtenida exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                codigo: 'EE',
                nombre: 'Estudios de Especialidad',
                descripcion: 'Cursos de especialidad de la carrera',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                cursos: [
                    {
                        id: 1,
                        codigo: 'IS101',
                        nombre: 'Programación I',
                        ciclo: 3,
                        creditos: 4
                    }
                ]
            }
        }
   } */
  areaController.getAreaById(req, res);
});

// Obtener cursos por área
router.get('/:id/cursos', verifyToken, (req, res) => {
  // #swagger.tags = ['Áreas']
  // #swagger.summary = 'Obtener cursos por área'
  // #swagger.description = 'Obtiene todos los cursos que pertenecen a un área específica'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del área' }
  /* #swagger.responses[200] = {
        description: 'Lista de cursos por área obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    codigo: 'IS101',
                    nombre: 'Programación I',
                    ciclo: 3,
                    creditos: 4,
                    tipo: 'obligatorio',
                    activo: true
                },
                {
                    id: 2,
                    codigo: 'IS102',
                    nombre: 'Base de Datos I',
                    ciclo: 4,
                    creditos: 4,
                    tipo: 'obligatorio',
                    activo: true
                }
            ]
        }
   } */
  areaController.getCursosByArea(req, res);
});

// Actualizar un área
router.put('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Áreas']
  // #swagger.summary = 'Actualizar un área'
  // #swagger.description = 'Actualiza los datos de un área existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del área' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos a actualizar',
        required: true,
        schema: {
            codigo: 'EE',
            nombre: 'Estudios de Especialidad Actualizado',
            descripcion: 'Cursos de especialidad de la carrera actualizados',
            activo: true
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Área actualizada exitosamente',
        schema: {
            success: true,
            message: 'Área actualizada exitosamente',
            data: {
                id: 1,
                codigo: 'EE',
                nombre: 'Estudios de Especialidad Actualizado',
                descripcion: 'Cursos de especialidad de la carrera actualizados',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  areaController.updateArea(req, res);
});

// Eliminar un área (desactivación lógica)
router.delete('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Áreas']
  // #swagger.summary = 'Eliminar un área'
  // #swagger.description = 'Desactiva lógicamente un área existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del área' }
  /* #swagger.responses[200] = {
        description: 'Área eliminada exitosamente',
        schema: {
            success: true,
            message: 'Área desactivada exitosamente'
        }
   } */
  areaController.deleteArea(req, res);
});

module.exports = router;