import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiShoppingBag, FiEye, FiTrash2, FiFilter } from 'react-icons/fi';
import { pedidoService } from '../services/api';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const Pedidos = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estadoFilter, setEstadoFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, pedidoId: null });

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const data = await pedidoService.getAll();
      setPedidos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los pedidos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`/pedidos/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, pedidoId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await pedidoService.delete(deleteModal.pedidoId);
      setPedidos(pedidos.filter(p => p.id !== deleteModal.pedidoId));
      setDeleteModal({ isOpen: false, pedidoId: null });
    } catch (err) {
      setError('Error al eliminar el pedido');
      console.error(err);
    }
  };

  const filteredPedidos = pedidos.filter(pedido => {
    return estadoFilter === '' || pedido.estado === estadoFilter;
  });

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
      month: 'short',
      day: 'numeric'
    });
  };

  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      en_proceso: 'bg-blue-100 text-blue-800',
      completado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
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

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FiShoppingBag className="text-gaba-primary" />
            Pedidos
          </h1>
          <p className="text-gray-500 mt-1">Gestiona los pedidos de tus clientes</p>
        </div>
        
        <Link
          to="/pedidos/nuevo"
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={20} />
          Nuevo Pedido
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <FiFilter className="text-gray-400" size={20} />
        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="input-field sm:w-64"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En Proceso</option>
          <option value="completado">Completado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {filteredPedidos.length === 0 ? (
        <div className="card text-center py-12">
          <FiShoppingBag className="mx-auto text-gray-300" size={48} />
          <p className="text-gray-500 mt-4">
            {estadoFilter ? 'No hay pedidos con ese estado' : 'No hay pedidos registrados'}
          </p>
          {!estadoFilter && (
            <Link
              to="/pedidos/nuevo"
              className="btn-primary inline-flex items-center gap-2 mt-4"
            >
              <FiPlus size={20} />
              Crear primer pedido
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gaba-primary text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold"># Pedido</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Estado</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Total</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Abonado</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Pendiente</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPedidos.map(pedido => {
                const pendiente = parseFloat(pedido.total) - parseFloat(pedido.total_abonado);
                return (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">#{pedido.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{pedido.cliente?.nombre || 'Sin cliente'}</p>
                        {pedido.cliente?.telefono && (
                          <p className="text-xs text-gray-500">{pedido.cliente.telefono}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(pedido.fecha)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(pedido.estado)}`}>
                        {getEstadoLabel(pedido.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-gray-800">
                      {formatPrice(pedido.total)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-green-600">
                      {formatPrice(pedido.total_abonado)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium">
                      <span className={pendiente > 0 ? 'text-red-600' : 'text-green-600'}>
                        {formatPrice(pendiente)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleView(pedido.id)}
                          className="p-2 text-gaba-primary hover:bg-gaba-light rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(pedido.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, pedidoId: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Pedido"
        message="¿Estás seguro de que deseas eliminar este pedido? El stock de los productos será restaurado."
      />
    </div>
  );
};

export default Pedidos;
