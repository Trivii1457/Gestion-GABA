import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Bienvenido a <span className="text-gaba-primary">Gestión GABA</span>
      </h1>
      
      <p className="text-gray-600 mb-8">
        Sistema de gestión para tienda de gorros y accesorios médicos
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-r from-gaba-primary to-gaba-secondary text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <FiUsers size={24} />
            </div>
            <div>
              <p className="text-sm opacity-80">Módulo</p>
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
              <FiShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm opacity-80">Próximamente</p>
              <h3 className="text-xl font-semibold">Pedidos</h3>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-80">
            Gestiona los pedidos de tus clientes
          </p>
          <button
            disabled
            className="mt-4 inline-block bg-white/50 text-white px-4 py-2 rounded font-medium cursor-not-allowed"
          >
            Próximamente
          </button>
        </div>

        <div className="card bg-gradient-to-r from-gaba-tertiary to-gaba-light text-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gaba-primary/20 rounded-lg">
              <FiTrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm opacity-80">Próximamente</p>
              <h3 className="text-xl font-semibold">Reportes</h3>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-80">
            Visualiza estadísticas y reportes
          </p>
          <button
            disabled
            className="mt-4 inline-block bg-gaba-primary/50 text-white px-4 py-2 rounded font-medium cursor-not-allowed"
          >
            Próximamente
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Acerca de GABA</h2>
        <p className="text-gray-600">
          GABA es tu tienda de confianza para gorros y accesorios médicos de alta calidad. 
          Este sistema te permite gestionar tus clientes y pedidos de manera eficiente.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
