const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Alumno = sequelize.define('Alumno', {
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
  escuelaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'escuelas',
      key: 'id'
    }
  },
  planEstudioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'planes_estudio',
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
  fechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  fechaIngreso: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  cicloActual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  estado: {
    type: DataTypes.ENUM('activo', 'egresado', 'retirado', 'suspendido'),
    allowNull: false,
    defaultValue: 'activo'
  }
}, {
  tableName: 'alumnos',
  timestamps: true
});

module.exports = Alumno;