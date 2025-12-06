import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiShoppingBag, FiTrendingUp, FiPackage, FiDollarSign, FiClock } from 'react-icons/fi';
import { pedidoService, clienteService, productoService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    clientes: 0,
    productos: 0,
    pedidos: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [clientesData, productosData, reporteData] = await Promise.all([
        clienteService.getAll(),
        productoService.getAll(),
        pedidoService.getReporteFinanciero()
      ]);
      setStats({
        clientes: clientesData.length,
        productos: productosData.length,
        pedidos: reporteData
      });
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
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

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Bienvenido a <span className="text-gaba-primary">Gestión GABA</span>
      </h1>
      
      <p className="text-gray-600 mb-8">
        Sistema de gestión para tienda de gorros y accesorios médicos
      </p>

      {/* Quick stats */}
      {!loading && stats.pedidos && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card bg-white flex items-center gap-4">
            <div className="p-3 bg-gaba-light rounded-lg">
              <FiDollarSign className="text-gaba-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Ventas</p>
              <p className="text-xl font-bold text-gray-800">{formatPrice(stats.pedidos.totalVentas)}</p>
            </div>
          </div>
          <div className="card bg-white flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiDollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cobrado</p>
              <p className="text-xl font-bold text-green-600">{formatPrice(stats.pedidos.totalCobrado)}</p>
            </div>
          </div>
          <div className="card bg-white flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <FiClock className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pendiente</p>
              <p className="text-xl font-bold text-red-600">{formatPrice(stats.pedidos.totalPendiente)}</p>
            </div>
          </div>
          <div className="card bg-white flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiShoppingBag className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pedidos Pendientes</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pedidos.pedidosPendientes}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-r from-gaba-primary to-gaba-secondary text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <FiUsers size={24} />
            </div>
            <div>
              <p className="text-sm opacity-80">{stats.clientes} registrados</p>
              <h3 className="text-xl font-semibold">Clientes</h3>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-80">
            Gestiona la información de tus clientes
          </p>
          <Link
            to="/clientes"
            className="mt-4 inline-block bg-white text-gaba-primary px-4 py-2 rounded font-medium hover:bg-gaba-light transition-colors"
          >
            Ver Clientes
          </Link>
        </div>

        <div className="card bg-gradient-to-r from-gaba-secondary to-gaba-tertiary text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <FiPackage size={24} />
            </div>
            <div>
              <p className="text-sm opacity-80">{stats.productos} disponibles</p>
              <h3 className="text-xl font-semibold">Productos</h3>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-80">
            Administra tu inventario
          </p>
          <Link
            to="/productos"
            className="mt-4 inline-block bg-white text-gaba-secondary px-4 py-2 rounded font-medium hover:bg-gaba-light transition-colors"
          >
            Ver Productos
          </Link>
        </div>

        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <FiShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm opacity-80">{stats.pedidos?.totalPedidos || 0} totales</p>
              <h3 className="text-xl font-semibold">Pedidos</h3>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-80">
            Gestiona los pedidos de clientes
          </p>
          <Link
            to="/pedidos"
            className="mt-4 inline-block bg-white text-green-600 px-4 py-2 rounded font-medium hover:bg-green-50 transition-colors"
          >
            Ver Pedidos
          </Link>
        </div>

        <div className="card bg-gradient-to-r from-gaba-tertiary to-gaba-light text-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gaba-primary/20 rounded-lg">
              <FiTrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm opacity-80">Finanzas</p>
              <h3 className="text-xl font-semibold">Reportes</h3>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-80">
            Visualiza estadísticas y reportes
          </p>
          <Link
            to="/reportes"
            className="mt-4 inline-block bg-gaba-primary text-white px-4 py-2 rounded font-medium hover:bg-gaba-secondary transition-colors"
          >
            Ver Reportes
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Acerca de GABA</h2>
        <p className="text-gray-600">
          GABA es tu tienda de confianza para gorros y accesorios médicos de alta calidad. 
          Este sistema te permite gestionar tus clientes, productos, pedidos y finanzas de manera eficiente.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
