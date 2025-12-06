import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingBag, FiDollarSign, FiPlus, FiTrash2, FiUser, FiMapPin, FiCalendar } from 'react-icons/fi';
import { pedidoService, abonoService } from '../services/api';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const PedidoDetalle = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAbonoForm, setShowAbonoForm] = useState(false);
  const [abonoData, setAbonoData] = useState({ monto: '', metodo_pago: 'efectivo', notas: '' });
  const [savingAbono, setSavingAbono] = useState(false);
  const [deleteAbonoModal, setDeleteAbonoModal] = useState({ isOpen: false, abonoId: null });
  const [updatingEstado, setUpdatingEstado] = useState(false);

  useEffect(() => {
    fetchPedido();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPedido = async () => {
    try {
      setLoading(true);
      const data = await pedidoService.getById(id);
      setPedido(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el pedido');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAbono = async (e) => {
    e.preventDefault();
    
    const saldoPendiente = parseFloat(pedido.total) - parseFloat(pedido.total_abonado);
    if (!abonoData.monto || parseFloat(abonoData.monto) <= 0) {
      setError('Ingresa un monto válido');
      return;
    }
    if (parseFloat(abonoData.monto) > saldoPendiente) {
      setError(`El monto excede el saldo pendiente de ${formatPrice(saldoPendiente)}`);
      return;
    }

    try {
      setSavingAbono(true);
      setError(null);
      await abonoService.create({
        pedido_id: parseInt(id),
        monto: parseFloat(abonoData.monto),
        metodo_pago: abonoData.metodo_pago,
        notas: abonoData.notas
      });
      setAbonoData({ monto: '', metodo_pago: 'efectivo', notas: '' });
      setShowAbonoForm(false);
      fetchPedido();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar el abono');
      console.error(err);
    } finally {
      setSavingAbono(false);
    }
  };

  const handleDeleteAbono = async () => {
    try {
      await abonoService.delete(deleteAbonoModal.abonoId);
      setDeleteAbonoModal({ isOpen: false, abonoId: null });
      fetchPedido();
    } catch (err) {
      setError('Error al eliminar el abono');
      console.error(err);
    }
  };

  const handleUpdateEstado = async (nuevoEstado) => {
    try {
      setUpdatingEstado(true);
      await pedidoService.updateEstado(id, nuevoEstado);
      fetchPedido();
    } catch (err) {
      setError('Error al actualizar el estado');
      console.error(err);
    } finally {
      setUpdatingEstado(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      en_proceso: 'bg-blue-100 text-blue-800 border-blue-300',
      completado: 'bg-green-100 text-green-800 border-green-300',
      cancelado: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      pendiente: 'Pendiente',
      en_proceso: 'En Proceso',
      completado: 'Completado',
      cancelado: 'Cancelado'
    };
    return labels[estado] || estado;
  };

  const getMetodoPagoLabel = (metodo) => {
    const labels = {
      efectivo: 'Efectivo',
      transferencia: 'Transferencia',
      tarjeta: 'Tarjeta',
      otro: 'Otro'
    };
    return labels[metodo] || metodo;
  };

  if (loading) return <Loading />;

  if (!pedido) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Pedido no encontrado</p>
        <Link to="/pedidos" className="btn-primary mt-4 inline-block">
          Volver a Pedidos
        </Link>
      </div>
    );
  }

  const saldoPendiente = parseFloat(pedido.total) - parseFloat(pedido.total_abonado);
  const porcentajePagado = (parseFloat(pedido.total_abonado) / parseFloat(pedido.total)) * 100;

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/pedidos"
          className="text-gaba-primary hover:text-gaba-secondary inline-flex items-center gap-2 mb-4"
        >
          <FiArrowLeft size={20} />
          Volver a Pedidos
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FiShoppingBag className="text-gaba-primary" />
              Pedido #{pedido.id}
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <FiCalendar size={16} />
              {formatDate(pedido.fecha)}
            </p>
          </div>
          
          <div className={`px-4 py-2 rounded-lg border-2 font-medium ${getEstadoColor(pedido.estado)}`}>
            {getEstadoLabel(pedido.estado)}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client info */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiUser className="text-gaba-primary" />
              Cliente
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">{pedido.cliente?.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Identificación</p>
                <p className="font-medium">{pedido.cliente?.identificacion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">{pedido.cliente?.telefono || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{pedido.cliente?.email || '-'}</p>
              </div>
            </div>
            {pedido.direccion_entrega && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <FiMapPin size={14} />
                  Dirección de entrega
                </p>
                <p className="font-medium">{pedido.direccion_entrega}</p>
              </div>
            )}
            {pedido.notas && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">Notas</p>
                <p className="font-medium">{pedido.notas}</p>
              </div>
            )}
          </div>

          {/* Products */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Productos</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Producto</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Precio Unit.</th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Cantidad</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pedido.detalles?.map((detalle, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{detalle.producto?.nombre}</p>
                        <p className="text-xs text-gray-500">{detalle.producto?.sku}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        {formatPrice(detalle.precio_unitario)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {detalle.cantidad}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatPrice(detalle.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right font-bold">Total:</td>
                    <td className="px-4 py-3 text-right font-bold text-gaba-primary">
                      {formatPrice(pedido.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payments history */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FiDollarSign className="text-gaba-primary" />
                Historial de Abonos
              </h2>
              {saldoPendiente > 0 && pedido.estado !== 'cancelado' && (
                <button
                  onClick={() => setShowAbonoForm(true)}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <FiPlus size={16} />
                  Registrar Abono
                </button>
              )}
            </div>

            {showAbonoForm && (
              <form onSubmit={handleAddAbono} className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-3">Nuevo Abono</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monto <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={abonoData.monto}
                      onChange={(e) => setAbonoData({ ...abonoData, monto: e.target.value })}
                      className="input-field"
                      placeholder="0"
                      min="0.01"
                      step="0.01"
                      max={saldoPendiente}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Máx: {formatPrice(saldoPendiente)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Método de Pago
                    </label>
                    <select
                      value={abonoData.metodo_pago}
                      onChange={(e) => setAbonoData({ ...abonoData, metodo_pago: e.target.value })}
                      className="input-field"
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas
                    </label>
                    <input
                      type="text"
                      value={abonoData.notas}
                      onChange={(e) => setAbonoData({ ...abonoData, notas: e.target.value })}
                      className="input-field"
                      placeholder="Opcional"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={savingAbono}
                    className="btn-primary text-sm"
                  >
                    {savingAbono ? 'Guardando...' : 'Guardar Abono'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAbonoForm(false);
                      setAbonoData({ monto: '', metodo_pago: 'efectivo', notas: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {pedido.abonos?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Fecha</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Método</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Monto</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Notas</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pedido.abonos.map((abono) => (
                      <tr key={abono.id}>
                        <td className="px-4 py-3 text-sm">
                          {formatDate(abono.fecha)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getMetodoPagoLabel(abono.metodo_pago)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-green-600">
                          {formatPrice(abono.monto)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {abono.notas || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setDeleteAbonoModal({ isOpen: true, abonoId: abono.id })}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                            title="Eliminar"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay abonos registrados</p>
            )}
          </div>
        </div>

        {/* Right column - Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Resumen Financiero</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Total del pedido</span>
                <span className="font-bold">{formatPrice(pedido.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total abonado</span>
                <span className="font-bold text-green-600">{formatPrice(pedido.total_abonado)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Saldo pendiente</span>
                <span className={`font-bold ${saldoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatPrice(saldoPendiente)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progreso de pago</span>
                <span className="font-medium">{porcentajePagado.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(porcentajePagado, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Status update */}
            {pedido.estado !== 'completado' && pedido.estado !== 'cancelado' && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Actualizar Estado</h3>
                <div className="flex flex-col gap-2">
                  {pedido.estado === 'pendiente' && (
                    <button
                      onClick={() => handleUpdateEstado('en_proceso')}
                      disabled={updatingEstado}
                      className="btn-secondary text-sm w-full"
                    >
                      Marcar En Proceso
                    </button>
                  )}
                  {(pedido.estado === 'pendiente' || pedido.estado === 'en_proceso') && (
                    <>
                      <button
                        onClick={() => handleUpdateEstado('completado')}
                        disabled={updatingEstado}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm w-full"
                      >
                        Marcar Completado
                      </button>
                      <button
                        onClick={() => handleUpdateEstado('cancelado')}
                        disabled={updatingEstado}
                        className="btn-danger text-sm w-full"
                      >
                        Cancelar Pedido
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteAbonoModal.isOpen}
        onClose={() => setDeleteAbonoModal({ isOpen: false, abonoId: null })}
        onConfirm={handleDeleteAbono}
        title="Eliminar Abono"
        message="¿Estás seguro de que deseas eliminar este abono? El saldo pendiente del pedido será actualizado."
      />
    </div>
  );
};

export default PedidoDetalle;
