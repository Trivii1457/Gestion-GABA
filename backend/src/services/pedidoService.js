const pedidoRepository = require('../repositories/pedidoRepository');
const detallePedidoRepository = require('../repositories/detallePedidoRepository');
const productoRepository = require('../repositories/productoRepository');
const clienteRepository = require('../repositories/clienteRepository');
const { sequelize } = require('../models');

class PedidoService {
  async getAllPedidos() {
    return await pedidoRepository.findAll();
  }

  async getPedidoById(id) {
    const pedido = await pedidoRepository.findById(id);
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }
    return pedido;
  }

  async getPedidosByCliente(clienteId) {
    return await pedidoRepository.findByCliente(clienteId);
  }

  async getPedidosByEstado(estado) {
    return await pedidoRepository.findByEstado(estado);
  }

  async createPedido(pedidoData, detalles) {
    const transaction = await sequelize.transaction();
    
    try {
      // Validate client
      const cliente = await clienteRepository.findById(pedidoData.cliente_id);
      if (!cliente) {
        throw new Error('Cliente no encontrado');
      }

      // Calculate total and validate products
      let total = 0;
      const detallesProcessed = [];

      for (const detalle of detalles) {
        const producto = await productoRepository.findById(detalle.producto_id);
        if (!producto) {
          throw new Error(`Producto con ID ${detalle.producto_id} no encontrado`);
        }

        if (producto.stock < detalle.cantidad) {
          throw new Error(`Stock insuficiente para el producto ${producto.nombre}`);
        }

        const precioUnitario = parseFloat(producto.precio);
        const subtotal = precioUnitario * detalle.cantidad;
        total += subtotal;

        detallesProcessed.push({
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio_unitario: precioUnitario,
          subtotal: subtotal
        });

        // Update stock
        await productoRepository.updateStock(detalle.producto_id, -detalle.cantidad);
      }

      // Create order
      const pedido = await pedidoRepository.create({
        ...pedidoData,
        total: total
      });

      // Create order details
      const detallesWithPedido = detallesProcessed.map(d => ({
        ...d,
        pedido_id: pedido.id
      }));
      await detallePedidoRepository.bulkCreate(detallesWithPedido);

      await transaction.commit();
      return await pedidoRepository.findById(pedido.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updatePedido(id, pedidoData) {
    const pedido = await pedidoRepository.update(id, pedidoData);
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }
    return pedido;
  }

  async updateEstado(id, estado) {
    const pedido = await pedidoRepository.update(id, { estado });
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }
    return pedido;
  }

  async deletePedido(id) {
    const pedido = await pedidoRepository.findById(id);
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }

    // Restore stock for each item
    for (const detalle of pedido.detalles) {
      await productoRepository.updateStock(detalle.producto_id, detalle.cantidad);
    }

    // Delete order details first
    await detallePedidoRepository.deleteByPedido(id);
    
    const deleted = await pedidoRepository.delete(id);
    if (!deleted) {
      throw new Error('Pedido no encontrado');
    }
    return true;
  }

  async getReporteFinanciero() {
    return await pedidoRepository.getReporteFinanciero();
  }
}

module.exports = new PedidoService();
