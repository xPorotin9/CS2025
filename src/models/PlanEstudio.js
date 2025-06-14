const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PlanEstudio = sequelize.define('PlanEstudio', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  escuelaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'escuelas',
      key: 'id'
    }
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechaFin: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  totalCreditos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  totalCiclos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'planes_estudio',
  timestamps: true
});

module.exports = PlanEstudio;