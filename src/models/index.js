// src/models/index.js
const Usuario = require('./Usuario');
const Facultad = require('./Facultad');
const Escuela = require('./Escuela');
const PlanEstudio = require('./PlanEstudio');
const Curso = require('./Curso');
const Prerequisito = require('./Prerequisito');
const Docente = require('./Docente');
const Alumno = require('./Alumno');
const PeriodoAcademico = require('./PeriodoAcademico');
const Seccion = require('./Seccion');
const Horario = require('./Horario');
const Matricula = require('./Matricula');
const DetalleMatricula = require('./DetalleMatricula');
const Pago = require('./Pago');
const Configuracion = require('./Configuracion');

// Relaciones entre las tablas

// Relaciones Facultad - Escuela
Facultad.hasMany(Escuela, { foreignKey: 'facultadId', as: 'escuelas' });
Escuela.belongsTo(Facultad, { foreignKey: 'facultadId', as: 'facultad' });

// Relaciones Facultad - Docente
Facultad.hasMany(Docente, { foreignKey: 'facultadId', as: 'docentes' });
Docente.belongsTo(Facultad, { foreignKey: 'facultadId', as: 'facultad' });

// Relaciones Escuela - PlanEstudio
Escuela.hasMany(PlanEstudio, { foreignKey: 'escuelaId', as: 'planesEstudio' });
PlanEstudio.belongsTo(Escuela, { foreignKey: 'escuelaId', as: 'escuela' });

// Relaciones PlanEstudio - Curso
PlanEstudio.hasMany(Curso, { foreignKey: 'planEstudioId', as: 'cursos' });
Curso.belongsTo(PlanEstudio, { foreignKey: 'planEstudioId', as: 'planEstudio' });

// Relaciones Curso - Prerequisito
Curso.hasMany(Prerequisito, { foreignKey: 'cursoId', as: 'prerequisitosRequeridos' });
Prerequisito.belongsTo(Curso, { foreignKey: 'cursoId', as: 'curso' });

Curso.hasMany(Prerequisito, { foreignKey: 'prerequisitoId', as: 'cursosQueRequierenEste' });
Prerequisito.belongsTo(Curso, { foreignKey: 'prerequisitoId', as: 'cursoPrerequisito' });

// Relaciones Usuario - Docente/Alumno
Usuario.hasOne(Docente, { foreignKey: 'usuarioId', as: 'docente' });
Docente.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Usuario.hasOne(Alumno, { foreignKey: 'usuarioId', as: 'alumno' });
Alumno.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// Relaciones Escuela - Alumno
Escuela.hasMany(Alumno, { foreignKey: 'escuelaId', as: 'alumnos' });
Alumno.belongsTo(Escuela, { foreignKey: 'escuelaId', as: 'escuela' });

// Relaciones PlanEstudio - Alumno
PlanEstudio.hasMany(Alumno, { foreignKey: 'planEstudioId', as: 'alumnos' });
Alumno.belongsTo(PlanEstudio, { foreignKey: 'planEstudioId', as: 'planEstudio' });

// Relaciones Curso - Seccion
Curso.hasMany(Seccion, { foreignKey: 'cursoId', as: 'secciones' });
Seccion.belongsTo(Curso, { foreignKey: 'cursoId', as: 'curso' });

// Relaciones PeriodoAcademico - Seccion
PeriodoAcademico.hasMany(Seccion, { foreignKey: 'periodoAcademicoId', as: 'secciones' });
Seccion.belongsTo(PeriodoAcademico, { foreignKey: 'periodoAcademicoId', as: 'periodoAcademico' });

// Relaciones Docente - Seccion
Docente.hasMany(Seccion, { foreignKey: 'docenteId', as: 'secciones' });
Seccion.belongsTo(Docente, { foreignKey: 'docenteId', as: 'docente' });

// Relaciones Seccion - Horario
Seccion.hasMany(Horario, { foreignKey: 'seccionId', as: 'horarios' });
Horario.belongsTo(Seccion, { foreignKey: 'seccionId', as: 'seccion' });

// Relaciones Alumno - Matricula
Alumno.hasMany(Matricula, { foreignKey: 'alumnoId', as: 'matriculas' });
Matricula.belongsTo(Alumno, { foreignKey: 'alumnoId', as: 'alumno' });

// Relaciones PeriodoAcademico - Matricula
PeriodoAcademico.hasMany(Matricula, { foreignKey: 'periodoAcademicoId', as: 'matriculas' });
Matricula.belongsTo(PeriodoAcademico, { foreignKey: 'periodoAcademicoId', as: 'periodoAcademico' });

// Relaciones Matricula - DetalleMatricula
Matricula.hasMany(DetalleMatricula, { foreignKey: 'matriculaId', as: 'detallesMatricula' });
DetalleMatricula.belongsTo(Matricula, { foreignKey: 'matriculaId', as: 'matricula' });

// Relaciones Seccion - DetalleMatricula
Seccion.hasMany(DetalleMatricula, { foreignKey: 'seccionId', as: 'detallesMatricula' });
DetalleMatricula.belongsTo(Seccion, { foreignKey: 'seccionId', as: 'seccion' });

// Relaciones Matricula - Pago
Matricula.hasMany(Pago, { foreignKey: 'matriculaId', as: 'pagos' });
Pago.belongsTo(Matricula, { foreignKey: 'matriculaId', as: 'matricula' });

module.exports = {
  Usuario,
  Facultad,
  Escuela,
  PlanEstudio,
  Curso,
  Prerequisito,
  Docente,
  Alumno,
  PeriodoAcademico,
  Seccion,
  Horario,
  Matricula,
  DetalleMatricula,
  Pago,
  Configuracion
};