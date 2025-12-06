const abonoRepository = require('../repositories/abonoRepository');
const pedidoRepository = require('../repositories/pedidoRepository');

class AbonoService {
  async getAllAbonos() {
    return await abonoRepository.findAll();
  }

  async getAbonoById(id) {
    const abono = await abonoRepository.findById(id);
    if (!abono) {
      throw new Error('Abono no encontrado');
    }
    return abono;
  }

  async getAbonosByPedido(pedidoId) {
    return await abonoRepository.findByPedido(pedidoId);
  }

  async createAbono(abonoData) {
    const pedido = await pedidoRepository.findById(abonoData.pedido_id);
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }

    const saldoPendiente = parseFloat(pedido.total) - parseFloat(pedido.total_abonado);
    if (parseFloat(abonoData.monto) > saldoPendiente) {
      throw new Error(`El monto del abono excede el saldo pendiente de $${saldoPendiente.toFixed(2)}`);
    }

    const abono = await abonoRepository.create(abonoData);

    // Update total_abonado in pedido
    const nuevoTotalAbonado = parseFloat(pedido.total_abonado) + parseFloat(abonoData.monto);
    await pedidoRepository.updateTotalAbonado(abonoData.pedido_id, nuevoTotalAbonado);

    // If fully paid, optionally update status
    if (nuevoTotalAbonado >= parseFloat(pedido.total)) {
      await pedidoRepository.update(abonoData.pedido_id, { estado: 'completado' });
    }

    return abono;
  }

  async updateAbono(id, abonoData) {
    const abono = await abonoRepository.update(id, abonoData);
    if (!abono) {
      throw new Error('Abono no encontrado');
    }

    // Recalculate total_abonado for the order
    const totalAbonado = await abonoRepository.getTotalByPedido(abono.pedido_id);
    await pedidoRepository.updateTotalAbonado(abono.pedido_id, totalAbonado);

    return abono;
  }

  async deleteAbono(id) {
    const abono = await abonoRepository.findById(id);
    if (!abono) {
      throw new Error('Abono no encontrado');
    }

    const pedidoId = abono.pedido_id;
    const deleted = await abonoRepository.delete(id);
    if (!deleted) {
      throw new Error('Abono no encontrado');
    }

    // Recalculate total_abonado for the order
    const totalAbonado = await abonoRepository.getTotalByPedido(pedidoId);
    await pedidoRepository.updateTotalAbonado(pedidoId, totalAbonado);

    return true;
  }
}

module.exports = new AbonoService();
