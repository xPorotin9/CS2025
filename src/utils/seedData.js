const bcrypt = require('bcrypt');
const {
  Usuario,
  Facultad,
  Escuela,
  PlanEstudio,
  Curso,
  Prerequisito,
  Docente,
  Alumno,
  PeriodoAcademico,
  Configuracion
} = require('../models');

const seedData = async () => {
  try {
    console.log('Iniciando carga de datos iniciales...');

    // Crear usuario admin
    const adminUser = await Usuario.create({
      nombre: 'Administrador',
      apellido: 'Sistema',
      email: 'admin@matriculas.com',
      password: 'admin123',
      rol: 'admin'
    });

    console.log(`Usuario administrador creado con ID: ${adminUser.id}`);
    // Crear facultades
    const facultad1 = await Facultad.create({
      nombre: 'Facultad de Ingeniería',
      codigo: 'FING',
      descripcion: 'Facultad de Ingeniería y Arquitectura'
    });

    const facultad2 = await Facultad.create({
      nombre: 'Facultad de Ciencias',
      codigo: 'FCIEN',
      descripcion: 'Facultad de Ciencias Exactas y Naturales'
    });

    console.log('Facultades creadas');

    // Crear escuelas
    const escuela1 = await Escuela.create({
      facultadId: facultad1.id,
      nombre: 'Escuela de Ingeniería de Sistemas',
      codigo: 'EIS',
      descripcion: 'Escuela de Ingeniería de Sistemas e Informática'
    });

    const escuela2 = await Escuela.create({
      facultadId: facultad1.id,
      nombre: 'Escuela de Ingeniería Civil',
      codigo: 'EIC',
      descripcion: 'Escuela de Ingeniería Civil y Arquitectura'
    });

    const escuela3 = await Escuela.create({
      facultadId: facultad2.id,
      nombre: 'Escuela de Matemáticas',
      codigo: 'EMAT',
      descripcion: 'Escuela de Matemáticas Puras y Aplicadas'
    });

    console.log('Escuelas creadas');

    // Crear planes de estudio
    const plan1 = await PlanEstudio.create({
      escuelaId: escuela1.id,
      codigo: 'PIS-2022',
      nombre: 'Plan de Estudios Ing. Sistemas 2022',
      fechaInicio: '2022-01-01',
      totalCreditos: 210,
      totalCiclos: 10
    });

    const plan2 = await PlanEstudio.create({
      escuelaId: escuela2.id,
      codigo: 'PIC-2022',
      nombre: 'Plan de Estudios Ing. Civil 2022',
      fechaInicio: '2022-01-01',
      totalCreditos: 220,
      totalCiclos: 10
    });

    console.log('Planes de estudio creados');

    // Crear cursos para Ingeniería de Sistemas
    const curso1_1 = await Curso.create({
      planEstudioId: plan1.id,
      codigo: 'MAT101',
      nombre: 'Cálculo I',
      descripcion: 'Fundamentos de cálculo diferencial e integral',
      ciclo: 1,
      creditos: 4,
      horasTeoricas: 3,
      horasPracticas: 2,
      tipo: 'obligatorio'
    });

    const curso1_2 = await Curso.create({
      planEstudioId: plan1.id,
      codigo: 'FIS101',
      nombre: 'Física I',
      descripcion: 'Fundamentos de física mecánica',
      ciclo: 1,
      creditos: 4,
      horasTeoricas: 3,
      horasPracticas: 2,
      tipo: 'obligatorio'
    });

    const curso1_3 = await Curso.create({
      planEstudioId: plan1.id,
      codigo: 'PROG101',
      nombre: 'Fundamentos de Programación',
      descripcion: 'Introducción a la programación estructurada',
      ciclo: 1,
      creditos: 4,
      horasTeoricas: 2,
      horasPracticas: 4,
      tipo: 'obligatorio'
    });

    // Cursos de segundo ciclo
    const curso2_1 = await Curso.create({
      planEstudioId: plan1.id,
      codigo: 'MAT102',
      nombre: 'Cálculo II',
      descripcion: 'Cálculo diferencial e integral en varias variables',
      ciclo: 2,
      creditos: 4,
      horasTeoricas: 3,
      horasPracticas: 2,
      tipo: 'obligatorio'
    });

    const curso2_2 = await Curso.create({
      planEstudioId: plan1.id,
      codigo: 'FIS102',
      nombre: 'Física II',
      descripcion: 'Electricidad y magnetismo',
      ciclo: 2,
      creditos: 4,
      horasTeoricas: 3,
      horasPracticas: 2,
      tipo: 'obligatorio'
    });

    const curso2_3 = await Curso.create({
      planEstudioId: plan1.id,
      codigo: 'PROG102',
      nombre: 'Programación Orientada a Objetos',
      descripcion: 'Fundamentos de la programación orientada a objetos',
      ciclo: 2,
      creditos: 4,
      horasTeoricas: 2,
      horasPracticas: 4,
      tipo: 'obligatorio'
    });

    console.log('Cursos creados');

    // Crear prerrequisitos
    await Prerequisito.create({
      cursoId: curso2_1.id,
      prerequisitoId: curso1_1.id,
      tipoRequisito: 'obligatorio'
    });

    await Prerequisito.create({
      cursoId: curso2_2.id,
      prerequisitoId: curso1_2.id,
      tipoRequisito: 'obligatorio'
    });

    await Prerequisito.create({
      cursoId: curso2_3.id,
      prerequisitoId: curso1_3.id,
      tipoRequisito: 'obligatorio'
    });

    console.log('Prerequisitos creados');

    // Crear docentes
    const usuario_docente1 = await Usuario.create({
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@matriculas.com',
      password: await bcrypt.hash('password123', 10),
      rol: 'docente'
    });

    const usuario_docente2 = await Usuario.create({
      nombre: 'Ana',
      apellido: 'Gómez',
      email: 'ana.gomez@matriculas.com',
      password: await bcrypt.hash('password123', 10),
      rol: 'docente'
    });

    const docente1 = await Docente.create({
      usuarioId: usuario_docente1.id,
      facultadId: facultad1.id,
      codigo: 'DOC001',
      dni: '12345678',
      especialidad: 'Desarrollo de Software',
      gradoAcademico: 'doctor',
      fechaIngreso: '2018-01-01'
    });

    const docente2 = await Docente.create({
      usuarioId: usuario_docente2.id,
      facultadId: facultad1.id,
      codigo: 'DOC002',
      dni: '87654321',
      especialidad: 'Base de Datos',
      gradoAcademico: 'magister',
      fechaIngreso: '2019-01-01'
    });

    console.log('Docentes creados');

    // Crear alumnos
    const usuario_alumno1 = await Usuario.create({
      nombre: 'Pedro',
      apellido: 'Sánchez',
      email: 'pedro.sanchez@matriculas.com',
      password: await bcrypt.hash('password123', 10),
      rol: 'alumno'
    });

    const usuario_alumno2 = await Usuario.create({
      nombre: 'María',
      apellido: 'López',
      email: 'maria.lopez@matriculas.com',
      password: await bcrypt.hash('password123', 10),
      rol: 'alumno'
    });

    const alumno1 = await Alumno.create({
      usuarioId: usuario_alumno1.id,
      escuelaId: escuela1.id,
      planEstudioId: plan1.id,
      codigo: 'ALU001',
      dni: '12345679',
      fechaNacimiento: '2000-05-15',
      direccion: 'Av. Universidad 123',
      telefono: '123456789',
      fechaIngreso: '2022-03-01',
      cicloActual: 1,
      estado: 'activo'
    });

    const alumno2 = await Alumno.create({
      usuarioId: usuario_alumno2.id,
      escuelaId: escuela1.id,
      planEstudioId: plan1.id,
      codigo: 'ALU002',
      dni: '98765432',
      fechaNacimiento: '2001-08-20',
      direccion: 'Calle Principal 456',
      telefono: '987654321',
      fechaIngreso: '2022-03-01',
      cicloActual: 1,
      estado: 'activo'
    });

    console.log('Alumnos creados');

    // Crear periodo académico actual
    const periodoActual = await PeriodoAcademico.create({
      nombre: 'Semestre 2025-I',
      codigo: '2025-1',
      fechaInicio: '2025-03-01',
      fechaFin: '2025-07-31',
      fechaInicioMatricula: '2025-02-01',
      fechaFinMatricula: '2025-02-15',
      fechaInicioMatriculaExtemporanea: '2025-02-16',
      fechaFinMatriculaExtemporanea: '2025-02-28',
      estado: 'en_curso'
    });

    console.log('Periodo académico creado');

    // Configuraciones del sistema
    await Configuracion.create({
      nombre: 'costo_credito',
      valor: '100',
      descripcion: 'Costo por crédito para matrícula regular',
      tipo: 'number'
    });

    await Configuracion.create({
      nombre: 'costo_credito_extemporaneo',
      valor: '120',
      descripcion: 'Costo por crédito para matrícula extemporánea',
      tipo: 'number'
    });

    await Configuracion.create({
      nombre: 'max_creditos_por_ciclo',
      valor: '22',
      descripcion: 'Máximo de créditos que un alumno puede llevar por ciclo',
      tipo: 'number'
    });

    console.log('Configuraciones creadas');

    console.log('Datos iniciales cargados exitosamente');
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
  }
};

module.exports = seedData;