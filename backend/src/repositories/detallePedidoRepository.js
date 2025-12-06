const { DetallePedido, Producto } = require('../models');

class DetallePedidoRepository {
  async findByPedido(pedidoId) {
    return await DetallePedido.findAll({
      where: { pedido_id: pedidoId },
      include: [{
        model: Producto,
        as: 'producto',
        attributes: ['id', 'nombre', 'sku', 'precio']
      }]
    });
  }

  async create(detalleData) {
    return await DetallePedido.create(detalleData);
  }

  async bulkCreate(detalles) {
    return await DetallePedido.bulkCreate(detalles);
  }

  async update(id, detalleData) {
    const detalle = await DetallePedido.findByPk(id);
    if (!detalle) {
      return null;
    }
    return await detalle.update(detalleData);
  }

  async delete(id) {
    const detalle = await DetallePedido.findByPk(id);
    if (!detalle) {
      return false;
    }
    await detalle.destroy();
    return true;
  }

  async deleteByPedido(pedidoId) {
    return await DetallePedido.destroy({
      where: { pedido_id: pedidoId }
    });
  }
}

module.exports = new DetallePedidoRepository();
