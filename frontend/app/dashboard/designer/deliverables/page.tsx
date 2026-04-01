'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { projectAPI } from '@/app/lib/api/endpoints';
import Alert from '@/components/ui/Alert';
import {
    FiUpload,
    FiPackage,
    FiEye,
    FiClock,
    FiCheckCircle,
    FiX,
    FiSearch,
    FiFilter
} from 'react-icons/fi';

interface Project {
    _id: string;
    title: string;
    serviceType: string;
    status: 'approved' | 'in-progress' | 'review' | 'completed' | 'cancelled';
    client: { name: string };
    deliverables: Array<{ filename: string; url: string; version?: number }>;
}

export default function DesignerDeliverablesPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [version, setVersion] = useState('');
    const [notes, setNotes] = useState('');

    const [filters, setFilters] = useState({
        search: '',
        status: '', // Puedes dejarlo vacío para "Todos los activos"
        page: 1,
        limit: 5
    });
    const [pagination, setPagination] = useState({ total: 0, pages: 1 });

    // Modifica el useEffect para que reaccione a los filtros
    useEffect(() => {
        fetchProjects();
    }, [filters]);


    const fetchProjects = async () => {
        try {
            setLoading(true);
            // Pasamos los filtros como query params
            const response = await projectAPI.getProjects(filters);
            const { projects, pagination: pagData } = response.data.data;

            setProjects(projects || []);
            setPagination(pagData || { total: 0, pages: 1 });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (project: Project) => {
        setSelectedProject(project);
        setSelectedFile(null);
        setVersion('');
        setNotes('');
        setUploadError('');
        setUploadSuccess('');
        setModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar extensión
            const allowed = /\.(zip|rar|7z|tar\.gz|gz)$/i;
            if (!allowed.test(file.name)) {
                setUploadError('Solo se permiten archivos comprimidos (.zip, .rar, .7z, .tar.gz)');
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
            setUploadError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedProject || !selectedFile) return;

        setUploading(true);
        setUploadError('');

        const formData = new FormData();
        formData.append('deliverable', selectedFile);
        if (version) formData.append('version', version);
        if (notes) formData.append('notes', notes);

        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${API_URL}/projects/${selectedProject._id}/deliverables`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                if (response.status === 413) {
                    throw new Error('El archivo excede el límite permitido de 50 MB.');
                }
                const data = await response.json().catch(() => null);
                throw new Error(data?.message || 'Error al subir entregable');
            }

            const data = await response.json();
            setUploadSuccess('Entregable subido correctamente');
            setTimeout(() => {
                setModalOpen(false);
                fetchProjects();
            }, 2000);
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const config: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
            approved: { color: 'bg-blue-100 text-blue-800', icon: <FiCheckCircle />, text: 'Aprobado' },
            'in-progress': { color: 'bg-purple-100 text-purple-800', icon: <FiClock />, text: 'En progreso' },
            review: { color: 'bg-orange-100 text-orange-800', icon: <FiEye />, text: 'En revisión' },
            completed: { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle />, text: 'Completado' },
        };

        // Si el status no existe en config, usamos un estilo gris por defecto en lugar de mentir diciendo "En progreso"
        const c = config[status] || { color: 'bg-gray-100 text-gray-800', icon: <FiPackage />, text: status };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${c.color}`}>
                {c.icon}
                <span className="ml-1">{c.text}</span>
            </span>
        );
    };

    const getServiceTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'branding': 'Diseño de Marca',
            'ux-ui': 'Diseño UX/UI',
            'graphic': 'Diseño Gráfico',
            'web': 'Diseño Web',
            'motion': 'Animación Gráfica',
            'illustration': 'Ilustración',
            'other': 'Otro'
        };
        return labels[type] || type;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <FiUpload className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Subir Entregables</h1>
                    <p className="text-gray-600 mt-1">
                        Selecciona un proyecto y sube el archivo comprimido con los entregables finales.
                    </p>
                </div>
            </div>

            {/* 2. Buscador: SIEMPRE VISIBLE (Aquí está el secreto del foco) */}
            <div className="bg-white rounded-xl shadow p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por título de proyecto..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={filters.search} // Volvemos a usar filters.search directamente
                            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <FiFilter className="text-gray-600 w-5 h-5" />
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        >
                            <option value="">Todos los activos</option>
                            <option value="approved">Aprobados</option>
                            <option value="in-progress">En progreso</option>
                            <option value="review">En revisión</option>
                            <option value="completed">Completados</option>
                        </select>
                    </div>
                </div>
            </div>
            {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

            <div className="relative min-h-100">
                {loading ? (
                    // Spinner que NO desmonta el buscador, solo cubre el área de la tabla
                    <div className="absolute inset-0 flex justify-center items-center bg-white/50 z-10 rounded-xl">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : null}
                {projects.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-12 text-center">
                        <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No hay proyectos activos</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            No tienes proyectos en progreso o aprobados para subir entregables.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Proyecto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Entregables
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {projects.map((project) => (
                                    <tr key={project._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{project.title.length > 30
                                                ? project.title.substring(0, 30) + '...'
                                                : project.title}</div>
                                            <div className="text-sm text-gray-500">{getServiceTypeLabel(project.serviceType)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {project.client?.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(project.status)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {project.deliverables?.length || 0} archivo(s)
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(project)}
                                                    className="text-purple-600 hover:text-purple-900 transition-colors"
                                                    title="Subir entregable"
                                                >
                                                    <FiUpload className="w-4 h-4" />
                                                </button>
                                                <Link
                                                    href={`/dashboard/projects/${project._id}`}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                    title="Ver detalles del proyecto"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal de subida */}
                {modalOpen && selectedProject && (
                    <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Subir entregable: {selectedProject.title}
                                    </h2>
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <FiX className="w-6 h-6" />
                                    </button>
                                </div>

                                {uploadError && <Alert type="error" message={uploadError} onClose={() => setUploadError('')} className="mb-4" />}
                                {uploadSuccess && <Alert type="success" message={uploadSuccess} onClose={() => setUploadSuccess('')} className="mb-4" />}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Archivo comprimido (.zip, .rar, .7z, .tar.gz) *
                                        </label>
                                        <input
                                            type="file"
                                            accept=".zip,.rar,.7z,.tar.gz,.gz"
                                            onChange={handleFileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 file:hidden"
                                        />

                                        <p className="text-xs text-gray-500 mt-1">
                                            Máximo 100 MB.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Versión (opcional)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={version}
                                            onChange={(e) => setVersion(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Ej: 1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notas (opcional)
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Comentarios sobre esta entrega..."
                                            maxLength={500}
                                        />
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-xs text-gray-500">
                                                {notes.length}/500 caracteres
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                        disabled={uploading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={!selectedFile || uploading}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center"
                                    >
                                        {uploading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Subiendo...
                                            </>
                                        ) : (
                                            <>
                                                <FiUpload className="mr-2" />
                                                Subir
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Paginación */}
            {pagination && pagination.pages > 1 && (
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Mostrando {((filters.page - 1) * filters.limit) + 1} - {Math.min(filters.page * filters.limit, pagination.total)} de {pagination.total} resultados
                    </div>
                    <div className="flex space-x-2">
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            disabled={filters.page === 1}
                            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2">
                            Página {filters.page} de {pagination.pages}
                        </span>
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            disabled={filters.page === pagination.pages}
                            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}