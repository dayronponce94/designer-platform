'use client';

import { FiImage, FiPlus, FiEdit, FiTrash2, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import { useState } from 'react';

export default function DesignerPortfolioPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <FiImage className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mi Portafolio</h1>
                            <p className="text-gray-600 mt-1">
                                Muestra tus mejores trabajos a los clientes
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    >
                        <FiGrid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    >
                        <FiList className="w-5 h-5" />
                    </button>

                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <FiPlus className="mr-2" />
                        Agregar Trabajo
                    </button>
                </div>
            </div>

            {/* Contenido placeholder */}
            <div className="bg-white rounded-xl shadow p-8 text-center">
                <FiImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Tu portafolio está vacío
                </h3>
                <p className="text-gray-600 mb-6">
                    Agrega tus mejores trabajos para atraer más clientes y mostrar tu experiencia.
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <FiPlus className="inline mr-2" />
                    Agregar primer trabajo al portafolio
                </button>
            </div>

            {/* Información */}
            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                    ¿Por qué es importante tener un portafolio?
                </h3>
                <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                        <FiPlus className="w-4 h-4 text-purple-500 mr-2 mt-1" />
                        <span>Muestra tu experiencia y estilo de diseño a los clientes</span>
                    </li>
                    <li className="flex items-start">
                        <FiPlus className="w-4 h-4 text-purple-500 mr-2 mt-1" />
                        <span>Incrementa tu credibilidad y tasa de contratación</span>
                    </li>
                    <li className="flex items-start">
                        <FiPlus className="w-4 h-4 text-purple-500 mr-2 mt-1" />
                        <span>Atrae proyectos que se alineen con tu especialidad</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}