const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DetalleMatricula = sequelize.define('DetalleMatricula', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  matriculaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'matriculas',
      key: 'id'
    }
  },
  seccionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'secciones',
      key: 'id'
    }
  },
  estado: {
    type: DataTypes.ENUM('activo', 'retirado'),
    allowNull: false,
    defaultValue: 'activo'
  }
}, {
  tableName: 'detalles_matricula',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['matriculaId', 'seccionId']
    }
  ]
});

module.exports = DetalleMatricula;