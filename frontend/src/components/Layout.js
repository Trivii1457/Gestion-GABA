import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiPackage } from 'react-icons/fi';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gaba-primary to-gaba-secondary text-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FiPackage className="text-gaba-light" />
            GABA
          </h1>
          <p className="text-sm text-gaba-light mt-1">Accesorios Médicos</p>
        </div>
        
        <nav className="mt-6">
          <Link
            to="/"
            className={`flex items-center gap-3 px-6 py-3 transition-colors ${
              isActive('/') && location.pathname === '/'
                ? 'bg-white/20 border-r-4 border-gaba-light'
                : 'hover:bg-white/10'
            }`}
          >
            <FiHome size={20} />
            <span>Inicio</span>
          </Link>
          
          <Link
            to="/clientes"
            className={`flex items-center gap-3 px-6 py-3 transition-colors ${
              isActive('/clientes')
                ? 'bg-white/20 border-r-4 border-gaba-light'
                : 'hover:bg-white/10'
            }`}
          >
            <FiUsers size={20} />
            <span>Clientes</span>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default Layout;
