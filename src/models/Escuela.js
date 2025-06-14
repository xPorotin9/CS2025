const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Escuela = sequelize.define('Escuela', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  facultadId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'facultades',
      key: 'id'
    }
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
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'escuelas',
  timestamps: true
});

module.exports = Escuela;