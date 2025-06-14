const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Seccion = sequelize.define('Seccion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cursoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cursos',
      key: 'id'
    }
  },
  periodoAcademicoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'periodos_academicos',
      key: 'id'
    }
  },
  docenteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'docentes',
      key: 'id'
    }
  },
  nombre: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  capacidadMaxima: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 40
  },
  capacidadActual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'secciones',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['cursoId', 'periodoAcademicoId', 'nombre']
    }
  ]
});

module.exports = Seccion;