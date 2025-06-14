const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docente.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Crear un nuevo docente
router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Docentes']
  // #swagger.summary = 'Crear un nuevo docente'
  // #swagger.description = 'Crea un nuevo docente en el sistema'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del docente',
        required: true,
        schema: {
            nombre: 'Juan',
            apellido: 'Pérez',
            email: 'juan.perez@universidad.edu',
            password: 'password123',
            facultadId: 1,
            codigo: 'DOC001',
            dni: '12345678',
            especialidad: 'Desarrollo de Software',
            gradoAcademico: 'doctor',
            fechaIngreso: '2020-01-01'
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Docente creado exitosamente',
        schema: {
            success: true,
            message: 'Docente creado exitosamente',
            data: {
                id: 1,
                usuarioId: 3,
                facultadId: 1,
                codigo: 'DOC001',
                dni: '12345678',
                especialidad: 'Desarrollo de Software',
                gradoAcademico: 'doctor',
                fechaIngreso: '2020-01-01',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                usuario: {
                    id: 3,
                    nombre: 'Juan',
                    apellido: 'Pérez',
                    email: 'juan.perez@universidad.edu',
                    rol: 'docente'
                },
                facultad: {
                    id: 1,
                    nombre: 'Facultad de Ingeniería',
                    codigo: 'FING'
                }
            }
        }
   } */
  docenteController.createDocente(req, res);
});

// Obtener todos los docentes
router.get('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Docentes']
  // #swagger.summary = 'Obtener todos los docentes'
  // #swagger.description = 'Obtiene la lista de todos los docentes con opciones de filtrado'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['facultadId'] = { in: 'query', description: 'ID de la facultad para filtrar' }
  // #swagger.parameters['activo'] = { in: 'query', description: 'Estado activo/inactivo para filtrar' }
  // #swagger.parameters['search'] = { in: 'query', description: 'Búsqueda por nombre, apellido, email o código' }
  /* #swagger.responses[200] = {
        description: 'Lista de docentes obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    usuarioId: 3,
                    facultadId: 1,
                    codigo: 'DOC001',
                    dni: '12345678',
                    especialidad: 'Desarrollo de Software',
                    gradoAcademico: 'doctor',
                    fechaIngreso: '2020-01-01',
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    usuario: {
                        id: 3,
                        nombre: 'Juan',
                        apellido: 'Pérez',
                        email: 'juan.perez@universidad.edu',
                        rol: 'docente'
                    },
                    facultad: {
                        id: 1,
                        nombre: 'Facultad de Ingeniería',
                        codigo: 'FING'
                    }
                },
                {
                    id: 2,
                    usuarioId: 4,
                    facultadId: 1,
                    codigo: 'DOC002',
                    dni: '87654321',
                    especialidad: 'Base de Datos',
                    gradoAcademico: 'magister',
                    fechaIngreso: '2019-01-01',
                    activo: true,
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    usuario: {
                        id: 4,
                        nombre: 'Ana',
                        apellido: 'Gómez',
                        email: 'ana.gomez@universidad.edu',
                        rol: 'docente'
                    },
                    facultad: {
                        id: 1,
                        nombre: 'Facultad de Ingeniería',
                        codigo: 'FING'
                    }
                }
            ]
        }
   } */
  docenteController.getAllDocentes(req, res);
});

// Obtener un docente por ID
router.get('/:id', verifyToken, (req, res) => {
// #swagger.tags = ['Docentes']
  // #swagger.summary = 'Obtener un docente por ID'
  // #swagger.description = 'Obtiene los detalles de un docente específico, incluyendo sus secciones asignadas'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del docente' }
  /* #swagger.responses[200] = {
        description: 'Docente obtenido exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                usuarioId: 3,
                facultadId: 1,
                codigo: 'DOC001',
                dni: '12345678',
                especialidad: 'Desarrollo de Software',
                gradoAcademico: 'doctor',
                fechaIngreso: '2020-01-01',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                usuario: {
                    id: 3,
                    nombre: 'Juan',
                    apellido: 'Pérez',
                    email: 'juan.perez@universidad.edu',
                    rol: 'docente'
                },
                facultad: {
                    id: 1,
                    nombre: 'Facultad de Ingeniería',
                    codigo: 'FING'
                },
                secciones: [
                    {
                        id: 1,
                        nombre: 'A',
                        capacidadMaxima: 40,
                        capacidadActual: 20
                    }
                ]
            }
        }
   } */
  /* #swagger.responses[404] = {
        description: 'Docente no encontrado',
        schema: {
            success: false,
            message: 'Docente no encontrado'
        }
   } */
  docenteController.getDocenteById(req, res);
});

// Actualizar un docente
router.put('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Docentes']
  // #swagger.summary = 'Actualizar un docente'
  // #swagger.description = 'Actualiza los datos de un docente existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del docente' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos a actualizar',
        required: true,
        schema: {
            nombre: 'Juan Carlos',
            apellido: 'Pérez García',
            email: 'juancarlos.perez@universidad.edu',
            password: 'nuevapassword123',
            facultadId: 1,
            especialidad: 'Desarrollo de Software y Aplicaciones Web',
            gradoAcademico: 'doctor',
            activo: true
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Docente actualizado exitosamente',
        schema: {
            success: true,
            message: 'Docente actualizado exitosamente',
            data: {
                id: 1,
                usuarioId: 3,
                facultadId: 1,
                codigo: 'DOC001',
                dni: '12345678',
                especialidad: 'Desarrollo de Software y Aplicaciones Web',
                gradoAcademico: 'doctor',
                fechaIngreso: '2020-01-01',
                activo: true,
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                usuario: {
                    id: 3,
                    nombre: 'Juan Carlos',
                    apellido: 'Pérez García',
                    email: 'juancarlos.perez@universidad.edu',
                    rol: 'docente'
                },
                facultad: {
                    id: 1,
                    nombre: 'Facultad de Ingeniería',
                    codigo: 'FING'
                }
            }
        }
   } */
  docenteController.updateDocente(req, res);
});

// Eliminar un docente (lógicamente)
router.delete('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Docentes']
  // #swagger.summary = 'Eliminar un docente'
  // #swagger.description = 'Desactiva lógicamente un docente existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del docente' }
  /* #swagger.responses[200] = {
        description: 'Docente eliminado exitosamente',
        schema: {
            success: true,
            message: 'Docente eliminado exitosamente'
        }
   } */
  docenteController.deleteDocente(req, res);
});

module.exports = router;