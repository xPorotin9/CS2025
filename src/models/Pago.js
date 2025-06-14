const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pago = sequelize.define('Pago', {
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
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fechaPago: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  metodoPago: {
    type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'otro'),
    allowNull: false,
    defaultValue: 'efectivo'
  },
  numeroOperacion: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'completado', 'anulado'),
    allowNull: false,
    defaultValue: 'completado'
  }
}, {
  tableName: 'pagos',
  timestamps: true
});

module.exports = Pago;