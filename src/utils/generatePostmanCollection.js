const fs = require('fs');
const path = require('path');

// Ruta donde se guardará el archivo de la colección
const outputPath = path.join(__dirname, 'matriculas_api_collection.json');

// URL base para todas las peticiones
const baseUrl = 'http://localhost:3000/api';

// Estructura básica de la colección
const collection = {
  info: {
    name: "Sistema de Matrículas API",
    description: "Colección completa de endpoints para el sistema de matrículas de alumnos",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  item: [],
  variable: [
    {
      key: "base_url",
      value: baseUrl,
      type: "string"
    }
  ]
};

// Función para crear una carpeta con solicitudes
function createFolder(name, requests) {
  return {
    name: name,
    item: requests
  };
}

// Función para crear una solicitud
function createRequest(name, method, path, body = null, description = "", requiresAuth = true) {
  const request = {
    name: name,
    request: {
      method: method,
      header: [],
      url: {
        raw: `{{base_url}}/${path}`,
        host: ["{{base_url}}"],
        path: path.split('/')
      },
      description: description
    },
    response: []
  };

  // Añadir header de autorización si es necesario
  if (requiresAuth) {
    request.request.header.push({
      key: "Authorization",
      value: "Bearer {{token}}"
    });
  }

  // Añadir cuerpo si es una petición POST, PUT o PATCH
  if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
    request.request.header.push({
      key: "Content-Type",
      value: "application/json"
    });
    request.request.body = {
      mode: "raw",
      raw: JSON.stringify(body, null, 2)
    };
  }

  return request;
}

// 1. Crear carpeta de autenticación
const authRequests = [
  createRequest("Registrar administrador", "POST", "auth/register", {
    nombre: "Admin",
    apellido: "Sistema",
    email: "admin@matriculas.com",
    password: "admin123",
    rol: "admin"
  }, "Registra un nuevo usuario administrador", false),
  createRequest("Iniciar sesión", "POST", "auth/login", {
    email: "admin@matriculas.com",
    password: "admin123"
  }, "Inicia sesión y obtiene un token JWT", false),
  createRequest("Obtener perfil", "GET", "auth/profile", null, "Obtiene el perfil del usuario autenticado")
];

// Añadir script para guardar el token en el evento de test para la solicitud de inicio de sesión
authRequests[1].event = [
  {
    listen: "test",
    script: {
      exec: [
        "var jsonData = pm.response.json();",
        "if (jsonData.data && jsonData.data.token) {",
        "    pm.environment.set(\"token\", jsonData.data.token);",
        "}"
      ],
      type: "text/javascript"
    }
  }
];

// 2. Crear carpeta de facultades
const facultadRequests = [
  createRequest("Crear facultad", "POST", "facultades", {
    nombre: "Facultad de Ingeniería",
    codigo: "FING",
    descripcion: "Facultad de ingeniería y tecnología"
  }, "Crea una nueva facultad"),
  createRequest("Crear otra facultad", "POST", "facultades", {
    nombre: "Facultad de Ciencias",
    codigo: "FCIEN",
    descripcion: "Facultad de ciencias exactas y naturales"
  }, "Crea otra facultad"),
  createRequest("Obtener todas las facultades", "GET", "facultades", null, "Obtiene la lista de todas las facultades"),
  createRequest("Obtener facultad por ID", "GET", "facultades/1", null, "Obtiene los detalles de una facultad específica"),
  createRequest("Actualizar facultad", "PUT", "facultades/1", {
    nombre: "Facultad de Ingeniería Actualizada",
    descripcion: "Facultad de ingeniería, tecnología y arquitectura",
    activo: true
  }, "Actualiza los datos de una facultad existente"),
  createRequest("Eliminar facultad", "DELETE", "facultades/2", null, "Desactiva lógicamente una facultad")
];

// 3. Crear carpeta de escuelas
const escuelaRequests = [
  createRequest("Crear escuela", "POST", "escuelas", {
    facultadId: 1,
    nombre: "Escuela de Ingeniería de Sistemas",
    codigo: "EIS",
    descripcion: "Escuela de ingeniería de sistemas e informática"
  }, "Crea una nueva escuela"),
  createRequest("Crear otra escuela", "POST", "escuelas", {
    facultadId: 1,
    nombre: "Escuela de Ingeniería Civil",
    codigo: "EIC",
    descripcion: "Escuela de ingeniería civil y arquitectura"
  }, "Crea otra escuela"),
  createRequest("Obtener todas las escuelas", "GET", "escuelas", null, "Obtiene la lista de todas las escuelas"),
  createRequest("Obtener escuelas por facultad", "GET", "escuelas/facultad/1", null, "Obtiene todas las escuelas de una facultad"),
  createRequest("Obtener escuela por ID", "GET", "escuelas/1", null, "Obtiene los detalles de una escuela específica"),
  createRequest("Actualizar escuela", "PUT", "escuelas/1", {
    nombre: "Escuela de Ingeniería de Sistemas Actualizada",
    descripcion: "Escuela especializada en ingeniería de sistemas, software e informática",
    activo: true
  }, "Actualiza los datos de una escuela existente"),
  createRequest("Eliminar escuela", "DELETE", "escuelas/2", null, "Desactiva lógicamente una escuela")
];

// 4. Crear carpeta de planes de estudio
const planEstudioRequests = [
  createRequest("Crear plan de estudio", "POST", "planes-estudio", {
    escuelaId: 1,
    codigo: "PE-2025",
    nombre: "Plan de Estudios 2025",
    fechaInicio: "2025-01-01",
    fechaFin: "2027-12-31",
    totalCreditos: 200,
    totalCiclos: 10
  }, "Crea un nuevo plan de estudio"),
  createRequest("Crear otro plan de estudio", "POST", "planes-estudio", {
    escuelaId: 1,
    codigo: "PE-2024",
    nombre: "Plan de Estudios 2024",
    fechaInicio: "2024-01-01",
    fechaFin: "2028-12-31",
    totalCreditos: 210,
    totalCiclos: 10
  }, "Crea otro plan de estudio"),
  createRequest("Obtener todos los planes de estudio", "GET", "planes-estudio", null, "Obtiene la lista de todos los planes de estudio"),
  createRequest("Obtener planes de estudio por escuela", "GET", "planes-estudio/escuela/1", null, "Obtiene todos los planes de estudio de una escuela"),
  createRequest("Obtener plan de estudio por ID", "GET", "planes-estudio/1", null, "Obtiene los detalles de un plan de estudio específico"),
  createRequest("Actualizar plan de estudio", "PUT", "planes-estudio/1", {
    nombre: "Plan de Estudios 2025 Actualizado",
    totalCreditos: 205,
    activo: true
  }, "Actualiza los datos de un plan de estudio existente"),
  createRequest("Eliminar plan de estudio", "DELETE", "planes-estudio/2", null, "Desactiva lógicamente un plan de estudio")
];

// 5. Crear carpeta de cursos
const cursoRequests = [
  createRequest("Crear curso 1", "POST", "cursos", {
    planEstudioId: 1,
    codigo: "MAT101",
    nombre: "Cálculo I",
    descripcion: "Fundamentos de cálculo diferencial e integral",
    ciclo: 1,
    creditos: 4,
    horasTeoricas: 3,
    horasPracticas: 2,
    tipo: "obligatorio"
  }, "Crea un nuevo curso"),
  createRequest("Crear curso 2", "POST", "cursos", {
    planEstudioId: 1,
    codigo: "FIS101",
    nombre: "Física I",
    descripcion: "Fundamentos de física mecánica",
    ciclo: 1,
    creditos: 4,
    horasTeoricas: 3,
    horasPracticas: 2,
    tipo: "obligatorio"
  }, "Crea un segundo curso"),
  createRequest("Crear curso 3", "POST", "cursos", {
    planEstudioId: 1,
    codigo: "PROG101",
    nombre: "Fundamentos de Programación",
    descripcion: "Introducción a la programación estructurada",
    ciclo: 1,
    creditos: 4,
    horasTeoricas: 2,
    horasPracticas: 4,
    tipo: "obligatorio"
  }, "Crea un tercer curso"),
  createRequest("Crear curso 4", "POST", "cursos", {
    planEstudioId: 1,
    codigo: "MAT102",
    nombre: "Cálculo II",
    descripcion: "Cálculo diferencial e integral en varias variables",
    ciclo: 2,
    creditos: 4,
    horasTeoricas: 3,
    horasPracticas: 2,
    tipo: "obligatorio"
  }, "Crea un cuarto curso"),
  createRequest("Obtener todos los cursos", "GET", "cursos", null, "Obtiene la lista de todos los cursos"),
  createRequest("Obtener cursos filtrados", "GET", "cursos?planEstudioId=1&ciclo=1", null, "Obtiene cursos con filtros"),
  createRequest("Obtener cursos por plan de estudio", "GET", "cursos/plan-estudio/1", null, "Obtiene todos los cursos de un plan de estudio"),
  createRequest("Obtener curso por ID", "GET", "cursos/1", null, "Obtiene los detalles de un curso específico"),
  createRequest("Actualizar curso", "PUT", "cursos/1", {
    nombre: "Cálculo I Actualizado",
    descripcion: "Fundamentos actualizados de cálculo diferencial e integral",
    creditos: 5,
    horasTeoricas: 3,
    horasPracticas: 4
  }, "Actualiza los datos de un curso existente"),
  createRequest("Eliminar curso", "DELETE", "cursos/3", null, "Desactiva lógicamente un curso")
];

// 6. Crear carpeta de prerequisitos
const prerequisitoRequests = [
  createRequest("Crear prerequisito 1", "POST", "prerequisitos", {
    cursoId: 4,
    prerequisitoId: 1,
    tipoRequisito: "obligatorio"
  }, "Crea un nuevo prerequisito"),
  createRequest("Crear prerequisito 2", "POST", "prerequisitos", {
    cursoId: 4,
    prerequisitoId: 2,
    tipoRequisito: "obligatorio"
  }, "Crea otro prerequisito"),
  createRequest("Obtener todos los prerequisitos", "GET", "prerequisitos", null, "Obtiene la lista de todos los prerequisitos"),
  createRequest("Obtener prerequisitos por curso", "GET", "prerequisitos/curso/4", null, "Obtiene todos los prerequisitos de un curso"),
  createRequest("Obtener cursos por prerequisito", "GET", "prerequisitos/prerequisito/1", null, "Obtiene todos los cursos que tienen como prerequisito a un curso específico"),
  createRequest("Actualizar prerequisito", "PUT", "prerequisitos/1", {
    tipoRequisito: "opcional"
  }, "Actualiza los datos de un prerequisito existente"),
  createRequest("Eliminar prerequisito", "DELETE", "prerequisitos/2", null, "Elimina un prerequisito")
];

// 7. Crear carpeta de docentes
const docenteRequests = [
  createRequest("Crear docente 1", "POST", "docentes", {
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@universidad.edu",
    password: "password123",
    facultadId: 1,
    codigo: "DOC001",
    dni: "12345678",
    especialidad: "Desarrollo de Software",
    gradoAcademico: "doctor",
    fechaIngreso: "2020-01-01"
  }, "Crea un nuevo docente"),
  createRequest("Crear docente 2", "POST", "docentes", {
    nombre: "Ana",
    apellido: "Gómez",
    email: "ana.gomez@universidad.edu",
    password: "password123",
    facultadId: 1,
    codigo: "DOC002",
    dni: "87654321",
    especialidad: "Base de Datos",
    gradoAcademico: "magister",
    fechaIngreso: "2019-01-01"
  }, "Crea otro docente"),
  createRequest("Obtener todos los docentes", "GET", "docentes", null, "Obtiene la lista de todos los docentes"),
  createRequest("Obtener docentes filtrados", "GET", "docentes?facultadId=1&search=Juan", null, "Obtiene docentes con filtros"),
  createRequest("Obtener docente por ID", "GET", "docentes/1", null, "Obtiene los detalles de un docente específico"),
  createRequest("Actualizar docente", "PUT", "docentes/1", {
    nombre: "Juan Carlos",
    apellido: "Pérez García",
    email: "juancarlos.perez@universidad.edu",
    especialidad: "Desarrollo de Software y Aplicaciones Web",
    gradoAcademico: "doctor"
  }, "Actualiza los datos de un docente existente"),
  createRequest("Eliminar docente", "DELETE", "docentes/2", null, "Desactiva lógicamente un docente")
];

// 8. Crear carpeta de alumnos
const alumnoRequests = [
  createRequest("Crear alumno 1", "POST", "alumnos", {
    nombre: "Pedro",
    apellido: "Sánchez",
    email: "pedro.sanchez@universidad.edu",
    password: "password123",
    escuelaId: 1,
    planEstudioId: 1,
    codigo: "ALU001",
    dni: "12345679",
    fechaNacimiento: "2000-05-15",
    direccion: "Av. Universidad 123",
    telefono: "123456789",
    fechaIngreso: "2022-03-01",
    cicloActual: 1
  }, "Crea un nuevo alumno"),
  createRequest("Crear alumno 2", "POST", "alumnos", {
    nombre: "María",
    apellido: "López",
    email: "maria.lopez@universidad.edu",
    password: "password123",
    escuelaId: 1,
    planEstudioId: 1,
    codigo: "ALU002",
    dni: "98765432",
    fechaNacimiento: "2001-08-20",
    direccion: "Calle Principal 456",
    telefono: "987654321",
    fechaIngreso: "2022-03-01",
    cicloActual: 1
  }, "Crea otro alumno"),
  createRequest("Obtener todos los alumnos", "GET", "alumnos", null, "Obtiene la lista de todos los alumnos"),
  createRequest("Obtener alumnos filtrados", "GET", "alumnos?escuelaId=1&search=Pedro", null, "Obtiene alumnos con filtros"),
  createRequest("Obtener alumno por ID", "GET", "alumnos/1", null, "Obtiene los detalles de un alumno específico"),
  createRequest("Actualizar alumno", "PUT", "alumnos/1", {
    nombre: "Pedro Luis",
    apellido: "Sánchez García",
    direccion: "Av. Universidad 456",
    telefono: "987654321",
    cicloActual: 2
  }, "Actualiza los datos de un alumno existente"),
  createRequest("Actualizar estado de alumno", "PATCH", "alumnos/2/estado", {
    estado: "egresado"
  }, "Actualiza el estado de un alumno"),
  createRequest("Obtener matrículas de alumno", "GET", "alumnos/1/matriculas", null, "Obtiene todas las matrículas de un alumno")
];

// 9. Crear carpeta de periodos académicos
const periodoAcademicoRequests = [
  createRequest("Crear periodo académico 1", "POST", "periodos-academicos", {
    nombre: "Semestre 2025-I",
    codigo: "2025-1",
    fechaInicio: "2025-03-01",
    fechaFin: "2025-07-31",
    fechaInicioMatricula: "2025-05-01",
    fechaFinMatricula: "2025-06-15",
    fechaInicioMatriculaExtemporanea: "2025-06-16",
    fechaFinMatriculaExtemporanea: "2025-06-28",
    estado: "programado"
  }, "Crea un nuevo periodo académico"),
  createRequest("Crear periodo académico 2", "POST", "periodos-academicos", {
    nombre: "Semestre 2025-II",
    codigo: "2025-2",
    fechaInicio: "2025-08-01",
    fechaFin: "2025-12-15",
    fechaInicioMatricula: "2025-07-01",
    fechaFinMatricula: "2025-07-15",
    fechaInicioMatriculaExtemporanea: "2025-07-16",
    fechaFinMatriculaExtemporanea: "2025-07-31",
    estado: "programado"
  }, "Crea otro periodo académico"),
  createRequest("Obtener todos los periodos académicos", "GET", "periodos-academicos", null, "Obtiene la lista de todos los periodos académicos"),
  createRequest("Obtener periodos académicos filtrados", "GET", "periodos-academicos?estado=programado", null, "Obtiene periodos académicos con filtros"),
  createRequest("Obtener periodo académico actual", "GET", "periodos-academicos/actual", null, "Obtiene el periodo académico actual o próximo"),
  createRequest("Obtener periodo académico por ID", "GET", "periodos-academicos/1", null, "Obtiene los detalles de un periodo académico específico"),
  createRequest("Actualizar periodo académico", "PUT", "periodos-academicos/1", {
    nombre: "Semestre 2025-I Actualizado",
    fechaInicioMatricula: "2025-05-05",
    fechaFinMatricula: "2025-06-20"
  }, "Actualiza los datos de un periodo académico existente"),
  createRequest("Actualizar estado de periodo académico", "PATCH", "periodos-academicos/1/estado", {
    estado: "en_curso"
  }, "Actualiza el estado de un periodo académico")
];

// 10. Crear carpeta de secciones
const seccionRequests = [
  createRequest("Crear sección 1", "POST", "secciones", {
    cursoId: 1,
    periodoAcademicoId: 1,
    docenteId: 1,
    nombre: "A",
    capacidadMaxima: 40
  }, "Crea una nueva sección"),
  createRequest("Crear sección 2", "POST", "secciones", {
    cursoId: 1,
    periodoAcademicoId: 1,
    docenteId: 1,
    nombre: "B",
    capacidadMaxima: 40
  }, "Crea otra sección para el mismo curso"),
  createRequest("Crear sección 3", "POST", "secciones", {
    cursoId: 2,
    periodoAcademicoId: 1,
    docenteId: 1,
    nombre: "A",
    capacidadMaxima: 40
  }, "Crea una sección para otro curso"),
  createRequest("Crear sección 4", "POST", "secciones", {
    cursoId: 3,
    periodoAcademicoId: 1,
    docenteId: 1,
    nombre: "A",
    capacidadMaxima: 40
  }, "Crea una sección para un tercer curso"),
  createRequest("Obtener todas las secciones", "GET", "secciones", null, "Obtiene la lista de todas las secciones"),
  createRequest("Obtener secciones filtradas", "GET", "secciones?periodoAcademicoId=1&docenteId=1", null, "Obtiene secciones con filtros"),
  createRequest("Obtener secciones por periodo académico", "GET", "secciones/periodo/1", null, "Obtiene todas las secciones de un periodo académico"),
  createRequest("Obtener secciones por curso y periodo", "GET", "secciones/curso/1/periodo/1", null, "Obtiene todas las secciones de un curso en un periodo específico"),
  createRequest("Obtener sección por ID", "GET", "secciones/1", null, "Obtiene los detalles de una sección específica"),
  createRequest("Actualizar sección", "PUT", "secciones/1", {
    nombre: "A1",
    capacidadMaxima: 45
  }, "Actualiza los datos de una sección existente"),
  createRequest("Eliminar sección", "DELETE", "secciones/2", null, "Desactiva lógicamente una sección")
];

// 11. Crear carpeta de horarios
const horarioRequests = [
  createRequest("Crear horario 1", "POST", "horarios", {
    seccionId: 1,
    dia: "lunes",
    horaInicio: "08:00:00",
    horaFin: "10:00:00",
    tipo: "teoria",
    aula: "A-101"
  }, "Crea un nuevo horario"),
  createRequest("Crear horario 2", "POST", "horarios", {
    seccionId: 1,
    dia: "miercoles",
    horaInicio: "08:00:00",
    horaFin: "10:00:00",
    tipo: "practica",
    aula: "A-101"
  }, "Crea otro horario para la misma sección"),
  createRequest("Crear horario 3", "POST", "horarios", {
    seccionId: 3,
    dia: "martes",
    horaInicio: "10:00:00",
    horaFin: "12:00:00",
    tipo: "teoria",
    aula: "A-102"
  }, "Crea un horario para otra sección"),
  createRequest("Crear horario 4", "POST", "horarios", {
    seccionId: 4,
    dia: "jueves",
    horaInicio: "14:00:00",
    horaFin: "18:00:00",
    tipo: "laboratorio",
    aula: "LAB-101"
  }, "Crea un horario para una tercera sección"),
  createRequest("Obtener todos los horarios", "GET", "horarios", null, "Obtiene la lista de todos los horarios"),
  createRequest("Obtener horarios filtrados", "GET", "horarios?dia=lunes&aula=A-101", null, "Obtiene horarios con filtros"),
  createRequest("Obtener horarios por sección", "GET", "horarios/seccion/1", null, "Obtiene todos los horarios de una sección"),
  createRequest("Obtener horario por ID", "GET", "horarios/1", null, "Obtiene los detalles de un horario específico"),
  createRequest("Actualizar horario", "PUT", "horarios/1", {
    dia: "lunes",
    horaInicio: "09:00:00",
    horaFin: "11:00:00",
    aula: "A-103"
  }, "Actualiza los datos de un horario existente"),
  createRequest("Eliminar horario", "DELETE", "horarios/2", null, "Elimina un horario")
];

// 12. Crear carpeta de matrículas
const matriculaRequests = [
  createRequest("Crear matrícula 1", "POST", "matriculas", {
    alumnoId: 1,
    periodoAcademicoId: 1,
    tipoMatricula: "regular",
    secciones: [
      {"seccionId": 1},
      {"seccionId": 3}
    ]
  }, "Crea una nueva matrícula"),
  createRequest("Crear matrícula 2", "POST", "matriculas", {
    alumnoId: 2,
    periodoAcademicoId: 1,
    tipoMatricula: "regular",
    secciones: [
      {"seccionId": 1},
      {"seccionId": 4}
    ]
  }, "Crea otra matrícula"),
  createRequest("Obtener todas las matrículas", "GET", "matriculas", null, "Obtiene la lista de todas las matrículas"),
  createRequest("Obtener matrículas filtradas", "GET", "matriculas?periodoAcademicoId=1&estado=pendiente", null, "Obtiene matrículas con filtros"),
  createRequest("Obtener matrículas por periodo académico", "GET", "matriculas/periodo/1", null, "Obtiene todas las matrículas de un periodo académico"),
  createRequest("Obtener matrícula por ID", "GET", "matriculas/1", null, "Obtiene los detalles de una matrícula específica"),
  createRequest("Actualizar estado de matrícula", "PATCH", "matriculas/1/estado", {
    estado: "pagado"
  }, "Actualiza el estado de una matrícula"),
  createRequest("Anular matrícula", "PATCH", "matriculas/2/anular", null, "Anula una matrícula"),
  createRequest("Generar reporte de matrículas", "GET", "matriculas/reporte/periodo/1", null, "Genera un reporte estadístico de matrículas para un periodo académico")
];

// 13. Crear carpeta de detalles de matrícula
const detalleMatriculaRequests = [
  createRequest("Obtener todos los detalles de matrícula", "GET", "detalles-matricula", null, "Obtiene la lista de todos los detalles de matrícula"),
  createRequest("Obtener detalles de matrícula filtrados", "GET", "detalles-matricula?matriculaId=1&estado=activo", null, "Obtiene detalles de matrícula con filtros"),
  createRequest("Obtener detalles por matrícula", "GET", "detalles-matricula/matricula/1", null, "Obtiene todos los detalles de una matrícula específica"),
  createRequest("Obtener detalle de matrícula por ID", "GET", "detalles-matricula/1", null, "Obtiene los detalles de un detalle de matrícula específico"),
  createRequest("Añadir detalle a matrícula", "POST", "detalles-matricula", {
    matriculaId: 1,
    seccionId: 4
  }, "Añade un curso (sección) a una matrícula existente"),
  createRequest("Retirar curso", "PATCH", "detalles-matricula/3/retirar", null, "Retira un curso de una matrícula")
];

// 14. Crear carpeta de pagos
const pagoRequests = [
  createRequest("Crear pago 1", "POST", "pagos", {
    matriculaId: 1,
    monto: 800,
    metodoPago: "transferencia",
    numeroOperacion: "TRF12345"
  }, "Crea un nuevo pago"),
  createRequest("Crear pago 2", "POST", "pagos", {
    matriculaId: 2,
    monto: 600,
    metodoPago: "efectivo"
  }, "Crea otro pago"),
  createRequest("Obtener todos los pagos", "GET", "pagos", null, "Obtiene la lista de todos los pagos"),
  createRequest("Obtener pagos filtrados", "GET", "pagos?metodoPago=transferencia&estado=completado", null, "Obtiene pagos con filtros"),
  createRequest("Obtener pagos por matrícula", "GET", "pagos/matricula/1", null, "Obtiene todos los pagos de una matrícula"),
createRequest("Obtener pago por ID", "GET", "pagos/1", null, "Obtiene los detalles de un pago específico"),
  createRequest("Anular pago", "PATCH", "pagos/2/anular", null, "Anula un pago")
];

// 15. Crear carpeta de configuraciones
const configuracionRequests = [
  createRequest("Crear configuración 1", "POST", "configuraciones", {
    nombre: "costo_credito",
    valor: "100",
    descripcion: "Costo por crédito para matrícula regular",
    tipo: "number"
  }, "Crea una nueva configuración"),
  createRequest("Crear configuración 2", "POST", "configuraciones", {
    nombre: "costo_credito_extemporaneo",
    valor: "120",
    descripcion: "Costo por crédito para matrícula extemporánea",
    tipo: "number"
  }, "Crea otra configuración"),
  createRequest("Crear configuración 3", "POST", "configuraciones", {
    nombre: "max_creditos_por_ciclo",
    valor: "22",
    descripcion: "Máximo de créditos que un alumno puede llevar por ciclo",
    tipo: "number"
  }, "Crea una tercera configuración"),
  createRequest("Crear configuración 4", "POST", "configuraciones", {
    nombre: "porcentaje_asistencia_minima",
    valor: "70",
    descripcion: "Porcentaje mínimo de asistencia requerido",
    tipo: "number"
  }, "Crea una cuarta configuración"),
  createRequest("Obtener todas las configuraciones", "GET", "configuraciones", null, "Obtiene la lista de todas las configuraciones"),
  createRequest("Obtener configuración por nombre", "GET", "configuraciones/costo_credito", null, "Obtiene una configuración específica por su nombre"),
  createRequest("Actualizar configuración", "PUT", "configuraciones/costo_credito", {
    valor: "110",
    descripcion: "Costo actualizado por crédito para matrícula regular"
  }, "Actualiza los datos de una configuración existente"),
  createRequest("Eliminar configuración", "DELETE", "configuraciones/porcentaje_asistencia_minima", null, "Elimina una configuración")
];

// Crear carpeta de flujo completo con pruebas para un proceso de matrícula
const flujoCompletoRequests = [
  // 1. Configuración inicial
  createRequest("1.1 Iniciar sesión como admin", "POST", "auth/login", {
    email: "admin@matriculas.com",
    password: "admin123"
  }, "Iniciar sesión como administrador para obtener token", false),
  createRequest("1.2 Crear facultad", "POST", "facultades", {
    nombre: "Facultad de Ingeniería",
    codigo: "FING",
    descripcion: "Facultad de ingeniería y tecnología"
  }, "Crear una facultad"),
  createRequest("1.3 Crear escuela", "POST", "escuelas", {
    facultadId: 1,
    nombre: "Escuela de Ingeniería de Sistemas",
    codigo: "EIS",
    descripcion: "Escuela de ingeniería de sistemas e informática"
  }, "Crear una escuela"),
  createRequest("1.4 Crear plan de estudio", "POST", "planes-estudio", {
    escuelaId: 1,
    codigo: "PE-2025",
    nombre: "Plan de Estudios 2025",
    fechaInicio: "2025-01-01",
    fechaFin: "2027-12-31",
    totalCreditos: 200,
    totalCiclos: 10
  }, "Crear un plan de estudio"),
  createRequest("1.5 Crear cursos", "POST", "cursos", {
    planEstudioId: 1,
    codigo: "MAT101",
    nombre: "Cálculo I",
    descripcion: "Fundamentos de cálculo diferencial e integral",
    ciclo: 1,
    creditos: 4,
    horasTeoricas: 3,
    horasPracticas: 2,
    tipo: "obligatorio"
  }, "Crear un curso"),
  createRequest("1.6 Crear configuración", "POST", "configuraciones", {
    nombre: "costo_credito",
    valor: "100",
    descripcion: "Costo por crédito para matrícula regular",
    tipo: "number"
  }, "Crear una configuración"),
  
  // 2. Configuración del periodo académico
  createRequest("2.1 Crear periodo académico", "POST", "periodos-academicos", {
    nombre: "Semestre 2025-I",
    codigo: "2025-1",
    fechaInicio: "2025-03-01",
    fechaFin: "2025-07-31",
    fechaInicioMatricula: "2025-05-01",
    fechaFinMatricula: "2025-06-15",
    fechaInicioMatriculaExtemporanea: "2025-06-16",
    fechaFinMatriculaExtemporanea: "2025-06-28",
    estado: "programado"
  }, "Crear un periodo académico"),
  createRequest("2.2 Actualizar estado periodo", "PATCH", "periodos-academicos/1/estado", {
    estado: "en_curso"
  }, "Actualizar estado del periodo a 'en_curso'"),
  
  // 3. Gestión de usuarios
  createRequest("3.1 Crear docente", "POST", "docentes", {
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@universidad.edu",
    password: "password123",
    facultadId: 1,
    codigo: "DOC001",
    dni: "12345678",
    especialidad: "Desarrollo de Software",
    gradoAcademico: "doctor",
    fechaIngreso: "2020-01-01"
  }, "Crear un docente"),
  createRequest("3.2 Crear alumno", "POST", "alumnos", {
    nombre: "Pedro",
    apellido: "Sánchez",
    email: "pedro.sanchez@universidad.edu",
    password: "password123",
    escuelaId: 1,
    planEstudioId: 1,
    codigo: "ALU001",
    dni: "12345679",
    fechaNacimiento: "2000-05-15",
    direccion: "Av. Universidad 123",
    telefono: "123456789",
    fechaIngreso: "2022-03-01",
    cicloActual: 1
  }, "Crear un alumno"),
  
  // 4. Configuración de clases
  createRequest("4.1 Crear sección", "POST", "secciones", {
    cursoId: 1,
    periodoAcademicoId: 1,
    docenteId: 1,
    nombre: "A",
    capacidadMaxima: 40
  }, "Crear una sección"),
  createRequest("4.2 Crear horario", "POST", "horarios", {
    seccionId: 1,
    dia: "lunes",
    horaInicio: "08:00:00",
    horaFin: "10:00:00",
    tipo: "teoria",
    aula: "A-101"
  }, "Crear un horario para la sección"),
  
  // 5. Proceso de matrícula
  createRequest("5.1 Crear matrícula", "POST", "matriculas", {
    alumnoId: 1,
    periodoAcademicoId: 1,
    tipoMatricula: "regular",
    secciones: [
      {"seccionId": 1}
    ]
  }, "Crear una matrícula para un alumno"),
  createRequest("5.2 Registrar pago", "POST", "pagos", {
    matriculaId: 1,
    monto: 400,
    metodoPago: "transferencia",
    numeroOperacion: "TRF12345"
  }, "Registrar un pago para la matrícula"),
  createRequest("5.3 Verificar estado matrícula", "GET", "matriculas/1", null, "Verificar que el estado de la matrícula ha cambiado a 'pagado'"),
  
  // 6. Reportes y consultas
  createRequest("6.1 Obtener reporte de matrículas", "GET", "matriculas/reporte/periodo/1", null, "Obtener reporte de matrículas del periodo"),
  createRequest("6.2 Obtener matrículas de alumno", "GET", "alumnos/1/matriculas", null, "Obtener matrículas por alumno"),
  createRequest("6.3 Obtener pagos por matrícula", "GET", "pagos/matricula/1", null, "Obtener pagos por matrícula")
];

// Añadir script para guardar el token en el evento de test para la solicitud de inicio de sesión en el flujo completo
flujoCompletoRequests[0].event = [
  {
    listen: "test",
    script: {
      exec: [
        "var jsonData = pm.response.json();",
        "if (jsonData.data && jsonData.data.token) {",
        "    pm.environment.set(\"token\", jsonData.data.token);",
        "}"
      ],
      type: "text/javascript"
    }
  }
];

// Añadir todas las carpetas a la colección
collection.item.push(createFolder("1. Autenticación", authRequests));
collection.item.push(createFolder("2. Facultades", facultadRequests));
collection.item.push(createFolder("3. Escuelas", escuelaRequests));
collection.item.push(createFolder("4. Planes de Estudio", planEstudioRequests));
collection.item.push(createFolder("5. Cursos", cursoRequests));
collection.item.push(createFolder("6. Prerequisitos", prerequisitoRequests));
collection.item.push(createFolder("7. Docentes", docenteRequests));
collection.item.push(createFolder("8. Alumnos", alumnoRequests));
collection.item.push(createFolder("9. Periodos Académicos", periodoAcademicoRequests));
collection.item.push(createFolder("10. Secciones", seccionRequests));
collection.item.push(createFolder("11. Horarios", horarioRequests));
collection.item.push(createFolder("12. Matrículas", matriculaRequests));
collection.item.push(createFolder("13. Detalles de Matrícula", detalleMatriculaRequests));
collection.item.push(createFolder("14. Pagos", pagoRequests));
collection.item.push(createFolder("15. Configuraciones", configuracionRequests));
collection.item.push(createFolder("16. Flujo Completo", flujoCompletoRequests));

// Guardar la colección en un archivo JSON
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));
console.log(`Colección generada correctamente en el archivo: ${outputPath}`);
console.log('Para importar la colección en Postman:');
console.log('1. Abrir Postman');
console.log('2. Hacer clic en "Import" en la esquina superior izquierda');
console.log('3. Arrastrar el archivo generado o hacer clic en "Upload Files" y seleccionarlo');
console.log('4. Hacer clic en "Import"');
console.log('5. Crear un ambiente con la variable: base_url = http://localhost:3000/api');