const express = require('express');
const router = express.Router();
const alumnoController = require('../controllers/alumno.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Crear un nuevo alumno
router.post('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Alumnos']
  // #swagger.summary = 'Crear un nuevo alumno'
  // #swagger.description = 'Crea un nuevo alumno en el sistema'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos del alumno',
        required: true,
        schema: {
            nombre: 'Pedro',
            apellido: 'Sánchez',
            email: 'pedro.sanchez@universidad.edu',
            password: 'password123',
            escuelaId: 1,
            planEstudioId: 1,
            codigo: 'ALU001',
            dni: '12345679',
            fechaNacimiento: '2000-05-15',
            direccion: 'Av. Universidad 123',
            telefono: '123456789',
            fechaIngreso: '2022-03-01',
            cicloActual: 1
        }
   } */
  /* #swagger.responses[201] = {
        description: 'Alumno creado exitosamente',
        schema: {
            success: true,
            message: 'Alumno creado exitosamente',
            data: {
                id: 1,
                usuarioId: 5,
                escuelaId: 1,
                planEstudioId: 1,
                codigo: 'ALU001',
                dni: '12345679',
                fechaNacimiento: '2000-05-15',
                direccion: 'Av. Universidad 123',
                telefono: '123456789',
                fechaIngreso: '2022-03-01',
                cicloActual: 1,
                estado: 'activo',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                usuario: {
                    id: 5,
                    nombre: 'Pedro',
                    apellido: 'Sánchez',
                    email: 'pedro.sanchez@universidad.edu',
                    rol: 'alumno'
                },
                escuela: {
                    id: 1,
                    nombre: 'Escuela de Ingeniería de Sistemas',
                    codigo: 'EIS'
                },
                planEstudio: {
                    id: 1,
                    nombre: 'Plan de Estudios 2023',
                    codigo: 'PE-2023'
                }
            }
        }
   } */
  alumnoController.createAlumno(req, res);
});

// Obtener todos los alumnos
router.get('/', verifyToken, (req, res) => {
  // #swagger.tags = ['Alumnos']
  // #swagger.summary = 'Obtener todos los alumnos'
  // #swagger.description = 'Obtiene la lista de todos los alumnos con opciones de filtrado'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['escuelaId'] = { in: 'query', description: 'ID de la escuela para filtrar' }
  // #swagger.parameters['planEstudioId'] = { in: 'query', description: 'ID del plan de estudio para filtrar' }
  // #swagger.parameters['estado'] = { in: 'query', description: 'Estado del alumno para filtrar (activo, egresado, retirado, suspendido)' }
  // #swagger.parameters['search'] = { in: 'query', description: 'Búsqueda por nombre, apellido, email, código o DNI' }
  /* #swagger.responses[200] = {
        description: 'Lista de alumnos obtenida exitosamente',
        schema: {
            success: true,
            count: 2,
            data: [
                {
                    id: 1,
                    usuarioId: 5,
                    escuelaId: 1,
                    planEstudioId: 1,
                    codigo: 'ALU001',
                    dni: '12345679',
                    fechaNacimiento: '2000-05-15',
                    direccion: 'Av. Universidad 123',
                    telefono: '123456789',
                    fechaIngreso: '2022-03-01',
                    cicloActual: 1,
                    estado: 'activo',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    usuario: {
                        id: 5,
                        nombre: 'Pedro',
                        apellido: 'Sánchez',
                        email: 'pedro.sanchez@universidad.edu',
                        rol: 'alumno'
                    },
                    escuela: {
                        id: 1,
                        nombre: 'Escuela de Ingeniería de Sistemas',
                        codigo: 'EIS'
                    },
                    planEstudio: {
                        id: 1,
                        nombre: 'Plan de Estudios 2023',
                        codigo: 'PE-2023'
                    }
                },
                {
                    id: 2,
                    usuarioId: 6,
                    escuelaId: 1,
                    planEstudioId: 1,
                    codigo: 'ALU002',
                    dni: '98765432',
                    fechaNacimiento: '2001-08-20',
                    direccion: 'Calle Principal 456',
                    telefono: '987654321',
                    fechaIngreso: '2022-03-01',
                    cicloActual: 1,
                    estado: 'activo',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                    usuario: {
                        id: 6,
                        nombre: 'María',
                        apellido: 'López',
                        email: 'maria.lopez@universidad.edu',
                        rol: 'alumno'
                    },
                    escuela: {
                        id: 1,
                        nombre: 'Escuela de Ingeniería de Sistemas',
                        codigo: 'EIS'
                    },
                    planEstudio: {
                        id: 1,
                        nombre: 'Plan de Estudios 2023',
                        codigo: 'PE-2023'
                    }
                }
            ]
        }
   } */
  alumnoController.getAllAlumnos(req, res);
});

// Obtener un alumno por ID
router.get('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Alumnos']
  // #swagger.summary = 'Obtener un alumno por ID'
  // #swagger.description = 'Obtiene los detalles de un alumno específico'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del alumno' }
  /* #swagger.responses[200] = {
        description: 'Alumno obtenido exitosamente',
        schema: {
            success: true,
            data: {
                id: 1,
                usuarioId: 5,
                escuelaId: 1,
                planEstudioId: 1,
                codigo: 'ALU001',
                dni: '12345679',
                fechaNacimiento: '2000-05-15',
                direccion: 'Av. Universidad 123',
                telefono: '123456789',
                fechaIngreso: '2022-03-01',
                cicloActual: 1,
                estado: 'activo',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                usuario: {
                    id: 5,
                    nombre: 'Pedro',
                    apellido: 'Sánchez',
                    email: 'pedro.sanchez@universidad.edu',
                    rol: 'alumno'
                },
                escuela: {
                    id: 1,
                    nombre: 'Escuela de Ingeniería de Sistemas',
                    codigo: 'EIS'
                },
                planEstudio: {
                    id: 1,
                    nombre: 'Plan de Estudios 2023',
                    codigo: 'PE-2023'
                }
            }
        }
   } */
  alumnoController.getAlumnoById(req, res);
});

// Obtener matrículas de un alumno
router.get('/:id/matriculas', verifyToken, (req, res) => {
  // #swagger.tags = ['Alumnos']
  // #swagger.summary = 'Obtener matrículas de un alumno'
  // #swagger.description = 'Obtiene todas las matrículas de un alumno específico'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del alumno' }
  /* #swagger.responses[200] = {
        description: 'Matrículas del alumno obtenidas exitosamente',
        schema: {
            success: true,
            count: 1,
            data: [
                {
                    id: 1,
                    alumnoId: 1,
                    periodoAcademicoId: 1,
                    fechaMatricula: '2023-03-01T00:00:00.000Z',
                    tipoMatricula: 'regular',
                    montoTotal: 1200,
                    creditosInscritos: 12,
                    estado: 'pagado',
                    createdAt: '2023-03-01T00:00:00.000Z',
                    updatedAt: '2023-03-01T00:00:00.000Z',
                    alumno: {
                        id: 1,
                        codigo: 'ALU001',
                        dni: '12345679',
                        usuario: {
                            nombre: 'Pedro',
                            apellido: 'Sánchez'
                        }
                    }
                }
            ]
        }
   } */
  alumnoController.getMatriculasByAlumno(req, res);
});

// Actualizar un alumno
router.put('/:id', verifyToken, (req, res) => {
  // #swagger.tags = ['Alumnos']
  // #swagger.summary = 'Actualizar un alumno'
  // #swagger.description = 'Actualiza los datos de un alumno existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del alumno' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos a actualizar',
        required: true,
        schema: {
            nombre: 'Pedro Luis',
            apellido: 'Sánchez García',
            email: 'pedro.sanchez@universidad.edu',
            password: 'nuevapassword123',
            escuelaId: 1,
            planEstudioId: 1,
            direccion: 'Av. Universidad 456',
            telefono: '987654321',
            cicloActual: 2,
            estado: 'activo'
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Alumno actualizado exitosamente',
        schema: {
            success: true,
            message: 'Alumno actualizado exitosamente',
            data: {
                id: 1,
                usuarioId: 5,
                escuelaId: 1,
                planEstudioId: 1,
                codigo: 'ALU001',
                dni: '12345679',
                fechaNacimiento: '2000-05-15',
                direccion: 'Av. Universidad 456',
                telefono: '987654321',
                fechaIngreso: '2022-03-01',
                cicloActual: 2,
                estado: 'activo',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z',
                usuario: {
                    id: 5,
                    nombre: 'Pedro Luis',
                    apellido: 'Sánchez García',
                    email: 'pedro.sanchez@universidad.edu',
                    rol: 'alumno'
                },
                escuela: {
                    id: 1,
                    nombre: 'Escuela de Ingeniería de Sistemas',
                    codigo: 'EIS'
                },
                planEstudio: {
                    id: 1,
                    nombre: 'Plan de Estudios 2023',
                    codigo: 'PE-2023'
                }
            }
        }
   } */
  alumnoController.updateAlumno(req, res);
});

// Actualizar estado de un alumno
router.patch('/:id/estado', verifyToken, (req, res) => {
  // #swagger.tags = ['Alumnos']
  // #swagger.summary = 'Actualizar estado de un alumno'
  // #swagger.description = 'Actualiza el estado de un alumno existente'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: 'ID del alumno' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Nuevo estado',
        required: true,
        schema: {
            estado: 'egresado'
        }
   } */
  /* #swagger.responses[200] = {
        description: 'Estado de alumno actualizado exitosamente',
        schema: {
            success: true,
            message: 'Estado de alumno actualizado exitosamente',
            data: {
                id: 1,
                estado: 'egresado'
            }
        }
   } */
  alumnoController.updateAlumnoEstado(req, res);
});

module.exports = router;