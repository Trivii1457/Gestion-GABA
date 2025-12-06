import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiPackage, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { path: '/', icon: FiHome, label: 'Inicio', exact: true },
    { path: '/clientes', icon: FiUsers, label: 'Clientes' },
    { path: '/productos', icon: FiPackage, label: 'Productos' },
    { path: '/pedidos', icon: FiShoppingBag, label: 'Pedidos' },
    { path: '/reportes', icon: FiTrendingUp, label: 'Reportes' },
  ];

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
          {navItems.map(({ path, icon: Icon, label, exact }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                (exact ? location.pathname === path : isActive(path))
                  ? 'bg-white/20 border-r-4 border-gaba-light'
                  : 'hover:bg-white/10'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
