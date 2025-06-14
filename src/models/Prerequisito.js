const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Prerequisito = sequelize.define('Prerequisito', {
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
  prerequisitoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cursos',
      key: 'id'
    }
  },
  tipoRequisito: {
    type: DataTypes.ENUM('obligatorio', 'opcional'),
    allowNull: false,
    defaultValue: 'obligatorio'
  }
}, {
  tableName: 'prerequisitos',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['cursoId', 'prerequisitoId']
    }
  ]
});

module.exports = Prerequisito;