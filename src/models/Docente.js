const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Docente = sequelize.define('Docente', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  facultadId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'facultades',
      key: 'id'
    }
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  dni: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true
  },
  especialidad: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  gradoAcademico: {
    type: DataTypes.ENUM('bachiller', 'magister', 'doctor', 'phd'),
    allowNull: false,
    defaultValue: 'bachiller'
  },
  fechaIngreso: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'docentes',
  timestamps: true
});

module.exports = Docente;