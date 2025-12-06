import React from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="bg-gaba-primary p-4 flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <FiAlertCircle size={20} />
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gaba-light transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="flex justify-end gap-3 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
