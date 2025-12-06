const { Abono, Pedido, Cliente } = require('../models');

class AbonoRepository {
  async findAll() {
    return await Abono.findAll({
      order: [['fecha', 'DESC']],
      include: [{
        model: Pedido,
        as: 'pedido',
        include: [{
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nombre']
        }]
      }]
    });
  }

  async findById(id) {
    return await Abono.findByPk(id, {
      include: [{
        model: Pedido,
        as: 'pedido',
        include: [{
          model: Cliente,
          as: 'cliente'
        }]
      }]
    });
  }

  async findByPedido(pedidoId) {
    return await Abono.findAll({
      where: { pedido_id: pedidoId },
      order: [['fecha', 'DESC']]
    });
  }

  async create(abonoData) {
    return await Abono.create(abonoData);
  }

  async update(id, abonoData) {
    const abono = await Abono.findByPk(id);
    if (!abono) {
      return null;
    }
    return await abono.update(abonoData);
  }

  async delete(id) {
    const abono = await Abono.findByPk(id);
    if (!abono) {
      return false;
    }
    await abono.destroy();
    return true;
  }

  async getTotalByPedido(pedidoId) {
    const abonos = await Abono.findAll({
      where: { pedido_id: pedidoId }
    });
    return abonos.reduce((sum, abono) => sum + parseFloat(abono.monto), 0);
  }
}

module.exports = new AbonoRepository();
