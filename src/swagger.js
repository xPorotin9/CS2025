// src/swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API de Matrículas',
    description: 'API para sistema de matrículas de alumnos',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Ingrese el token con el formato: Bearer {token}',
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    {
      name: 'Auth',
      description: 'Endpoints de autenticación'
    },
    {
      name: 'Facultades',
      description: 'Endpoints de facultades'
    },
    {
      name: 'Escuelas',
      description: 'Endpoints de escuelas'
    },
    {
      name: 'Planes de Estudio',
      description: 'Endpoints de planes de estudio'
    },
    {
      name: 'Cursos',
      description: 'Endpoints de cursos'
    },
    {
      name: 'Prerequisitos',
      description: 'Endpoints de prerequisitos'
    },
    {
      name: 'Docentes',
      description: 'Endpoints de docentes'
    },
    {
      name: 'Alumnos',
      description: 'Endpoints de alumnos'
    },
    {
      name: 'Periodos Académicos',
      description: 'Endpoints de periodos académicos'
    },
    {
      name: 'Secciones',
      description: 'Endpoints de secciones'
    },
    {
      name: 'Horarios',
      description: 'Endpoints de horarios'
    },
    {
      name: 'Matrículas',
      description: 'Endpoints de matrículas'
    },
    {
      name: 'Detalles de Matrícula',
      description: 'Endpoints de detalles de matrícula'
    },
    {
      name: 'Pagos',
      description: 'Endpoints de pagos'
    },
    {
      name: 'Configuraciones',
      description: 'Endpoints de configuraciones del sistema'
    }
  ],
definitions: {
  Usuario: {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@example.com',
    rol: 'admin',
    activo: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  Facultad: {
    id: 1,
    nombre: 'Facultad de Ingeniería',
    codigo: 'FING',
    descripcion: 'Facultad de ingeniería y tecnología',
    activo: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  Escuela: {
    id: 1,
    facultadId: 1,
    nombre: 'Escuela de Ingeniería de Sistemas',
    codigo: 'EIS',
    descripcion: 'Escuela de ingeniería de sistemas e informática',
    activo: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    facultad: {
      id: 1,
      nombre: 'Facultad de Ingeniería',
      codigo: 'FING'
    }
  },
  PlanEstudio: {
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
  Curso: {
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
  Prerequisito: {
    id: 1,
    cursoId: 2,
    prerequisitoId: 1,
    tipoRequisito: 'obligatorio',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    curso: {
      id: 2,
      nombre: 'Cálculo II',
      codigo: 'MAT102'
    },
    cursoPrerequisito: {
      id: 1,
      nombre: 'Cálculo I',
      codigo: 'MAT101'
    }
  },
  Docente: {
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
  Alumno: {
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
  PeriodoAcademico: {
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
  Seccion: {
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
      codigo: 'MAT101'
    },
    periodoAcademico: {
      id: 1,
      nombre: 'Semestre 2023-I',
      codigo: '2023-1'
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
  Horario: {
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
  Matricula: {
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
      usuario: {
        nombre: 'Pedro',
        apellido: 'Sánchez'
      }
    },
    periodoAcademico: {
      id: 1,
      nombre: 'Semestre 2023-I',
      codigo: '2023-1'
    }
  },
  DetalleMatricula: {
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
        codigo: 'MAT101'
      }
    }
  },
  Pago: {
    id: 1,
    matriculaId: 1,
    monto: 800,
    fechaPago: '2023-01-01T00:00:00.000Z',
    metodoPago: 'transferencia',
    numeroOperacion: 'TRF12345',
    estado: 'completado',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  Configuracion: {
    id: 1,
    nombre: 'costo_credito',
    valor: '100',
    descripcion: 'Costo por crédito para matrícula regular',
    tipo: 'number',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  }
}
};

const outputFile = './src/swagger-output.json';
const endpointsFiles = ['./src/index.js']; // archivo principal que carga todas las rutas

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Documentación Swagger generada');
});