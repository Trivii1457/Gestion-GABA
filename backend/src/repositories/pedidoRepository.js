const { Pedido, Cliente, DetallePedido, Producto, Abono } = require('../models');
const { Op } = require('sequelize');

class PedidoRepository {
  async findAll() {
    return await Pedido.findAll({
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nombre', 'identificacion', 'telefono']
        }
      ]
    });
  }

  async findById(id) {
    return await Pedido.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: 'cliente'
        },
        {
          model: DetallePedido,
          as: 'detalles',
          include: [{
            model: Producto,
            as: 'producto',
            attributes: ['id', 'nombre', 'sku']
          }]
        },
        {
          model: Abono,
          as: 'abonos',
          order: [['fecha', 'DESC']]
        }
      ]
    });
  }

  async findByCliente(clienteId) {
    return await Pedido.findAll({
      where: { cliente_id: clienteId },
      order: [['created_at', 'DESC']],
      include: [{
        model: Cliente,
        as: 'cliente',
        attributes: ['id', 'nombre', 'identificacion']
      }]
    });
  }

  async findByEstado(estado) {
    return await Pedido.findAll({
      where: { estado },
      order: [['created_at', 'DESC']],
      include: [{
        model: Cliente,
        as: 'cliente',
        attributes: ['id', 'nombre', 'identificacion', 'telefono']
      }]
    });
  }

  async create(pedidoData) {
    return await Pedido.create(pedidoData);
  }

  async update(id, pedidoData) {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return null;
    }
    return await pedido.update(pedidoData);
  }

  async updateTotalAbonado(id, totalAbonado) {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return null;
    }
    return await pedido.update({ total_abonado: totalAbonado });
  }

  async delete(id) {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return false;
    }
    await pedido.destroy();
    return true;
  }

  async getReporteFinanciero() {
    const pedidos = await Pedido.findAll({
      where: {
        estado: {
          [Op.ne]: 'cancelado'
        }
      }
    });

    const totalVentas = pedidos.reduce((sum, p) => sum + parseFloat(p.total), 0);
    const totalCobrado = pedidos.reduce((sum, p) => sum + parseFloat(p.total_abonado), 0);
    const totalPendiente = totalVentas - totalCobrado;

    const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;
    const pedidosEnProceso = pedidos.filter(p => p.estado === 'en_proceso').length;
    const pedidosCompletados = pedidos.filter(p => p.estado === 'completado').length;

    return {
      totalVentas,
      totalCobrado,
      totalPendiente,
      pedidosPendientes,
      pedidosEnProceso,
      pedidosCompletados,
      totalPedidos: pedidos.length
    };
  }
}

module.exports = new PedidoRepository();
