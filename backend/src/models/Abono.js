const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Abono = sequelize.define('Abono', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pedidos',
      key: 'id'
    }
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  metodo_pago: {
    type: DataTypes.ENUM('efectivo', 'transferencia', 'tarjeta', 'otro'),
    allowNull: false,
    defaultValue: 'efectivo'
  },
  notas: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'abonos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Abono;
