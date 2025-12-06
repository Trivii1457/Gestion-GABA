import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiUsers } from 'react-icons/fi';
import { clienteService } from '../services/api';
import ClienteCard from '../components/ClienteCard';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const Clientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, clienteId: null });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAll();
      setClientes(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/clientes/editar/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, clienteId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await clienteService.delete(deleteModal.clienteId);
      setClientes(clientes.filter(c => c.id !== deleteModal.clienteId));
      setDeleteModal({ isOpen: false, clienteId: null });
    } catch (err) {
      setError('Error al eliminar el cliente');
      console.error(err);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.identificacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FiUsers className="text-gaba-primary" />
            Clientes
          </h1>
          <p className="text-gray-500 mt-1">Gestiona la información de tus clientes</p>
        </div>
        
        <Link
          to="/clientes/nuevo"
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={20} />
          Nuevo Cliente
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o identificación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {filteredClientes.length === 0 ? (
        <div className="card text-center py-12">
          <FiUsers className="mx-auto text-gray-300" size={48} />
          <p className="text-gray-500 mt-4">
            {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
          </p>
          {!searchTerm && (
            <Link
              to="/clientes/nuevo"
              className="btn-primary inline-flex items-center gap-2 mt-4"
            >
              <FiPlus size={20} />
              Agregar primer cliente
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClientes.map(cliente => (
            <ClienteCard
              key={cliente.id}
              cliente={cliente}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, clienteId: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Cliente"
        message="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default Clientes;
