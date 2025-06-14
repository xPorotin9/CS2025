const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Curso = sequelize.define('Curso', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ciclo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  creditos: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  horasTeoricas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  horasPracticas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  tipo: {
    type: DataTypes.ENUM('obligatorio', 'electivo'),
    allowNull: false,
    defaultValue: 'obligatorio'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'cursos',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['planEstudioId', 'codigo']
    }
  ]
});

module.exports = Curso;