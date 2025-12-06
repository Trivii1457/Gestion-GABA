import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Loading = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <FiLoader className="animate-spin text-gaba-primary" size={32} />
      <span className="ml-2 text-gray-600">Cargando...</span>
    </div>
  );
};

export default Loading;
