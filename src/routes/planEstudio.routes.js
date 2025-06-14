const express = require('express');
const router = express.Router();
const planEstudioController = require('../controllers/planEstudio.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Crear un nuevo plan de estudio
router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Planes de Estudio']
  // #swagger.summary = 'Crear un nuevo plan de estudio'
  // #swagger.description = 'Crea un nuevo plan de estudio en el sistema'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del plan de estudio',
        required: true,
        schema: {
            escuelaId: 1,
            codigo: 'PE-2023',
            nombre: 'Plan de Estudios 2023',
            fechaInicio: '2023-01-01',
            fechaFin: '2027-12-31',
            totalCreditos: 200,
            totalCiclos: 10
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Plan de estudio creado exitosamente',
        schema: {
            success: true,
            message: 'Plan de estudio creado exitosamente',
            data: {
                id: 1,
                escuelaId: 1,
                codigo: 'PE-2023',
                nombre: 'Plan de Estudios 2023',
                fechaInicio: '2023-01-01',
                fechaFin: '2027-12-31',
                totalCreditos: 200,
                totalCiclos: 10,
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  planEstudioController.createPlanEstudio(req, res);
});

// Obtener todos los planes de estudio
router.get('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Planes de Estudio']
  // #swagger.summary = 'Obtener todos los planes de estudio'
  // #swagger.description = 'Obtiene la lista de todos los planes de estudio'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['escuelaId'] = { in: 'query', description: 'ID de la escuela para filtrar' }
  // #swagger.parameters['activo'] = { in: 'query', description: 'Estado activo/inactivo para filtrar' }
  /* #swagger.responses[200] = {
        description: 'Lista de planes de estudio obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    escuelaId: 1,
                    codigo: 'PE-2023',
                    nombre: 'Plan de Estudios 2023',
                    fechaInicio: '2023-01-01',
                    fechaFin: '2027-12-31',
                    totalCreditos: 200,
                    totalCiclos: 10,
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    escuela: {
                        id: 1,
                        nombre: 'Escuela de Ingeniería de Sistemas',
                        codigo: 'EIS'
                    }
                },
                {
                    id: 2,
                    escuelaId: 2,
                    codigo: 'PE-2023-IC',
                    nombre: 'Plan de Estudios 2023 - Ing. Civil',
                    fechaInicio: '2023-01-01',
                    fechaFin: '2027-12-31',
                    totalCreditos: 210,
                    totalCiclos: 10,
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    escuela: {
                        id: 2,
                        nombre: 'Escuela de Ingeniería Civil',
                        codigo: 'EIC'
                    }
                }
            ]
        }
   } */
  planEstudioController.getAllPlanesEstudio(req, res);
});

// Obtener planes de estudio por escuela
router.get('/escuela/:escuelaId', verifyToken, (req, res) => {
  // #swagger.tags = ['Planes de Estudio']
  // #swagger.summary = 'Obtener planes de estudio por escuela'
  // #swagger.description = 'Obtiene todos los planes de estudio que pertenecen a una escuela específica'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['escuelaId'] = { description: 'ID de la escuela' }
  /* #swagger.responses[200] = {
        description: 'Lista de planes de estudio por escuela obtenida exitosamente',
        schema: {
            success: true,
            count: 1,
            data: [
                {
                    id: 1,
                    escuelaId: 1,
                    codigo: 'PE-2023',
                    nombre: 'Plan de Estudios 2023',
                    fechaInicio: '2023-01-01',
                    fechaFin: '2027-12-31',
                    totalCreditos: 200,
                    totalCiclos: 10,
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z'
                }
            ]
        }
   } */
  planEstudioController.getPlanesEstudioByEscuela(req, res);
});

// Obtener un plan de estudio por ID
router.get('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Planes de Estudio']
  // #swagger.summary = 'Obtener un plan de estudio por ID'
  // #swagger.description = 'Obtiene los detalles de un plan de estudio específico'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del plan de estudio' }
  /* #swagger.responses[200] = {
        description: 'Plan de estudio obtenido exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                escuelaId: 1,
                codigo: 'PE-2023',
                nombre: 'Plan de Estudios 2023',
                fechaInicio: '2023-01-01',
                fechaFin: '2027-12-31',
                totalCreditos: 200,
                totalCiclos: 10,
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                escuela: {
                    id: 1,
                    nombre: 'Escuela de Ingeniería de Sistemas',
                    codigo: 'EIS'
                }
            }
        }
   } */
  planEstudioController.getPlanEstudioById(req, res);
});

// Actualizar un plan de estudio
router.put('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Planes de Estudio']
  // #swagger.summary = 'Actualizar un plan de estudio'
  // #swagger.description = 'Actualiza los datos de un plan de estudio existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del plan de estudio' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos a actualizar',
        required: true,
        schema: {
            nombre: 'Plan de Estudios 2023 Actualizado',
            fechaInicio: '2023-03-01',
            fechaFin: '2028-02-28',
            totalCreditos: 210,
            totalCiclos: 10,
            activo: true
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Plan de estudio actualizado exitosamente',
        schema: {
            success: true,
            message: 'Plan de estudio actualizado exitosamente',
            data: {
                id: 1,
                escuelaId: 1,
                codigo: 'PE-2023',
                nombre: 'Plan de Estudios 2023 Actualizado',
                fechaInicio: '2023-03-01',
                fechaFin: '2028-02-28',
                totalCreditos: 210,
                totalCiclos: 10,
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            }
        }
   } */
  planEstudioController.updatePlanEstudio(req, res);
});

// Eliminar un plan de estudio (desactivación lógica)
router.delete('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Planes de Estudio']
  // #swagger.summary = 'Eliminar un plan de estudio'
  // #swagger.description = 'Desactiva lógicamente un plan de estudio existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del plan de estudio' }
  /* #swagger.responses[200] = {
        description: 'Plan de estudio eliminado exitosamente',
        schema: {
            success: true,
            message: 'Plan de estudio desactivado exitosamente'
        }
   } */
  planEstudioController.deletePlanEstudio(req, res);
});

module.exports = router;