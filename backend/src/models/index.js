const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const Categoria = require('./Categoria');
const Producto = require('./Producto');
const Pedido = require('./Pedido');
const DetallePedido = require('./DetallePedido');
const Abono = require('./Abono');

// Define relationships
// Categoria - Producto
Categoria.hasMany(Producto, { foreignKey: 'categoria_id', as: 'productos' });
Producto.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });

// Cliente - Pedido
Cliente.hasMany(Pedido, { foreignKey: 'cliente_id', as: 'pedidos' });
Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// Pedido - DetallePedido
Pedido.hasMany(DetallePedido, { foreignKey: 'pedido_id', as: 'detalles' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'pedido_id', as: 'pedido' });

// Producto - DetallePedido
Producto.hasMany(DetallePedido, { foreignKey: 'producto_id', as: 'detalles' });
DetallePedido.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

// Pedido - Abono
Pedido.hasMany(Abono, { foreignKey: 'pedido_id', as: 'abonos' });
Abono.belongsTo(Pedido, { foreignKey: 'pedido_id', as: 'pedido' });

module.exports = {
  sequelize,
  Cliente,
  Categoria,
  Producto,
  Pedido,
  DetallePedido,
  Abono
};
