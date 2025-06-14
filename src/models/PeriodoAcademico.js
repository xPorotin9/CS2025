const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PeriodoAcademico = sequelize.define('PeriodoAcademico', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechaFin: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechaInicioMatricula: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechaFinMatricula: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechaInicioMatriculaExtemporanea: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  fechaFinMatriculaExtemporanea: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('programado', 'en_curso', 'finalizado'),
    allowNull: false,
    defaultValue: 'programado'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'periodos_academicos',
  timestamps: true
});

module.exports = PeriodoAcademico;