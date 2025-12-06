import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiClock, FiCheckCircle, FiAlertCircle, FiShoppingBag } from 'react-icons/fi';
import { pedidoService } from '../services/api';
import Loading from '../components/Loading';

const Reportes = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReporte();
  }, []);

  const fetchReporte = async () => {
    try {
      setLoading(true);
      const data = await pedidoService.getReporteFinanciero();
      setReporte(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el reporte');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price || 0);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="mx-auto text-red-400" size={48} />
        <p className="text-red-500 mt-4">{error}</p>
        <button onClick={fetchReporte} className="btn-primary mt-4">
          Reintentar
        </button>
      </div>
    );
  }

  const porcentajeCobrado = reporte?.totalVentas > 0 
    ? (reporte.totalCobrado / reporte.totalVentas) * 100 
    : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FiTrendingUp className="text-gaba-primary" />
          Reportes Financieros
        </h1>
        <p className="text-gray-500 mt-1">Resumen del estado financiero de tu negocio</p>
      </div>

      {/* Main financial cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-r from-gaba-primary to-gaba-secondary text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Ventas</p>
              <p className="text-3xl font-bold mt-1">{formatPrice(reporte?.totalVentas)}</p>
            </div>
            <div className="p-4 bg-white/20 rounded-full">
              <FiShoppingBag size={28} />
            </div>
          </div>
          <p className="text-sm opacity-80 mt-4">
            {reporte?.totalPedidos || 0} pedidos totales
          </p>
        </div>

        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Cobrado</p>
              <p className="text-3xl font-bold mt-1">{formatPrice(reporte?.totalCobrado)}</p>
            </div>
            <div className="p-4 bg-white/20 rounded-full">
              <FiCheckCircle size={28} />
            </div>
          </div>
          <p className="text-sm opacity-80 mt-4">
            {porcentajeCobrado.toFixed(1)}% del total
          </p>
        </div>

        <div className="card bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Pendiente por Cobrar</p>
              <p className="text-3xl font-bold mt-1">{formatPrice(reporte?.totalPendiente)}</p>
            </div>
            <div className="p-4 bg-white/20 rounded-full">
              <FiClock size={28} />
            </div>
          </div>
          <p className="text-sm opacity-80 mt-4">
            {(100 - porcentajeCobrado).toFixed(1)}% del total
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold mb-4">Progreso de Cobro</h2>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-600">Cobrado vs Total</span>
          <span className="font-medium text-gaba-primary">{porcentajeCobrado.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(porcentajeCobrado, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>Cobrado: {formatPrice(reporte?.totalCobrado)}</span>
          <span>Pendiente: {formatPrice(reporte?.totalPendiente)}</span>
        </div>
      </div>

      {/* Order status summary */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-6">Estado de Pedidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <FiClock className="text-yellow-600" size={28} />
            </div>
            <p className="text-4xl font-bold text-yellow-600">{reporte?.pedidosPendientes || 0}</p>
            <p className="text-sm text-yellow-700 mt-1">Pendientes</p>
          </div>

          <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FiShoppingBag className="text-blue-600" size={28} />
            </div>
            <p className="text-4xl font-bold text-blue-600">{reporte?.pedidosEnProceso || 0}</p>
            <p className="text-sm text-blue-700 mt-1">En Proceso</p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FiCheckCircle className="text-green-600" size={28} />
            </div>
            <p className="text-4xl font-bold text-green-600">{reporte?.pedidosCompletados || 0}</p>
            <p className="text-sm text-green-700 mt-1">Completados</p>
          </div>
        </div>
      </div>

      {/* Summary table */}
      <div className="card mt-8">
        <h2 className="text-lg font-semibold mb-4">Resumen General</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 text-gray-600">Total de pedidos</td>
                <td className="py-3 text-right font-medium">{reporte?.totalPedidos || 0}</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-600">Pedidos pendientes</td>
                <td className="py-3 text-right font-medium text-yellow-600">{reporte?.pedidosPendientes || 0}</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-600">Pedidos en proceso</td>
                <td className="py-3 text-right font-medium text-blue-600">{reporte?.pedidosEnProceso || 0}</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-600">Pedidos completados</td>
                <td className="py-3 text-right font-medium text-green-600">{reporte?.pedidosCompletados || 0}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-3 font-semibold">Total en ventas</td>
                <td className="py-3 text-right font-bold text-gaba-primary">{formatPrice(reporte?.totalVentas)}</td>
              </tr>
              <tr className="bg-green-50">
                <td className="py-3 font-semibold text-green-700">Total cobrado</td>
                <td className="py-3 text-right font-bold text-green-600">{formatPrice(reporte?.totalCobrado)}</td>
              </tr>
              <tr className="bg-red-50">
                <td className="py-3 font-semibold text-red-700">Pendiente por cobrar</td>
                <td className="py-3 text-right font-bold text-red-600">{formatPrice(reporte?.totalPendiente)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
