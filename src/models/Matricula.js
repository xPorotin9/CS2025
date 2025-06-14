const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Matricula = sequelize.define('Matricula', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  alumnoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'alumnos',
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
  fechaMatricula: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  tipoMatricula: {
    type: DataTypes.ENUM('regular', 'extemporanea'),
    allowNull: false,
    defaultValue: 'regular'
  },
  montoTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  creditosInscritos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'pagado', 'anulado'),
    allowNull: false,
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'matriculas',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['alumnoId', 'periodoAcademicoId']
    }
  ]
});

module.exports = Matricula;