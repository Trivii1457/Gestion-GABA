import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const ClienteCard = ({ cliente, onEdit, onDelete }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200 border-l-4 border-gaba-primary">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{cliente.nombre}</h3>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium">ID:</span> {cliente.identificacion}
          </p>
          {cliente.direccion && (
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium">Dirección:</span> {cliente.direccion}
            </p>
          )}
          {cliente.telefono && (
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium">Teléfono:</span> {cliente.telefono}
            </p>
          )}
          {cliente.email && (
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium">Email:</span> {cliente.email}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(cliente.id)}
            className="p-2 text-gaba-primary hover:bg-gaba-light rounded-lg transition-colors"
            title="Editar"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(cliente.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClienteCard;
