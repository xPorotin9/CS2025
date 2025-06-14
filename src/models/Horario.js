const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Horario = sequelize.define('Horario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  seccionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'secciones',
      key: 'id'
    }
  },
  dia: {
    type: DataTypes.ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
    allowNull: false
  },
  horaInicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  horaFin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('teoria', 'practica', 'laboratorio'),
    allowNull: false,
    defaultValue: 'teoria'
  },
  aula: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'horarios',
  timestamps: true
});

module.exports = Horario;