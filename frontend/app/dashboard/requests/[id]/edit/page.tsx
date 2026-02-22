'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/providers/AuthProvider';
import Alert from '@/components/ui/Alert';
import {
    FiArrowLeft, FiSave, FiX, FiUpload, FiFile,
    FiImage, FiFileText, FiTag, FiInfo, FiTrash2
} from 'react-icons/fi';

const SERVICE_TYPES = [
    { value: 'branding', label: 'Diseño de Marca' },
    { value: 'ux-ui', label: 'Diseño UX/UI' },
    { value: 'graphic', label: 'Diseño Gráfico' },
    { value: 'web', label: 'Diseño Web' },
    { value: 'motion', label: 'Animación Gráfica' },
    { value: 'illustration', label: 'Ilustración' },
    { value: 'other', label: 'Otro tipo de proyecto' },
];

interface Request {
    _id: string;
    title: string;
    description: string;
    serviceType: string;
    budget: number;
    deadline: string;
    references: string;
    attachments: Array<{
        url: string;
        filename: string;
        filetype: string;
        size: number;
        uploadedAt: string;
    }>;
}

export default function EditRequestPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthContext();

    const [request, setRequest] = useState<Request | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        serviceType: 'branding',
        budget: '',
        deadline: '',
        references: '',
    });

    const [newAttachments, setNewAttachments] = useState<File[]>([]);
    const [attachmentsPreview, setAttachmentsPreview] = useState<string[]>([]);
    const [attachmentsToRemove, setAttachmentsToRemove] = useState<string[]>([]);

    const requestId = params.id as string;

    useEffect(() => {
        fetchRequest();
    }, [requestId]);

    const fetchRequest = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/requests/${requestId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar solicitud');
            }

            const data = await response.json();
            if (data.success) {
                const requestData = data.data.request;
                setRequest(requestData);
                setFormData({
                    title: requestData.title,
                    description: requestData.description,
                    serviceType: requestData.serviceType,
                    budget: requestData.budget?.toString() || '',
                    deadline: requestData.deadline ? requestData.deadline.split('T')[0] : '',
                    references: requestData.references || '',
                });
            } else {
                setError(data.message);
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar la solicitud');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        setNewAttachments(prev => [...prev, ...newFiles]);

        // Crear previews para imágenes
        const imagePreviews = newFiles
            .filter(file => file.type.startsWith('image/'))
            .map(file => URL.createObjectURL(file));

        setAttachmentsPreview(prev => [...prev, ...imagePreviews]);
    };

    const removeNewAttachment = (index: number) => {
        setNewAttachments(prev => prev.filter((_, i) => i !== index));

        // También eliminar el preview si existe
        if (attachmentsPreview[index]) {
            URL.revokeObjectURL(attachmentsPreview[index]);
            setAttachmentsPreview(prev => prev.filter((_, i) => i !== index));
        }
    };

    const removeExistingAttachment = (attachmentUrl: string) => {
        setAttachmentsToRemove(prev => [...prev, attachmentUrl]);
    };

    const restoreExistingAttachment = (attachmentUrl: string) => {
        setAttachmentsToRemove(prev => prev.filter(url => url !== attachmentUrl));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');

        // Validaciones básicas
        if (!formData.title.trim()) {
            setError('El título del proyecto es requerido');
            setIsSaving(false);
            return;
        }

        if (!formData.description.trim()) {
            setError('La descripción del proyecto es requerida');
            setIsSaving(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');

            // Crear FormData para enviar
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('serviceType', formData.serviceType);

            if (formData.budget) {
                formDataToSend.append('budget', formData.budget);
            }

            if (formData.deadline) {
                formDataToSend.append('deadline', formData.deadline);
            }

            if (formData.references) {
                formDataToSend.append('references', formData.references);
            }

            // Agregar archivos nuevos (igual que en create)
            newAttachments.forEach((file) => {
                formDataToSend.append('attachments', file);
            });

            // Agregar archivos a eliminar (todos bajo el mismo nombre)
            attachmentsToRemove.forEach((attachmentUrl) => {
                formDataToSend.append('removeAttachments', attachmentUrl);
            });

            const response = await fetch(`/api/requests/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al actualizar solicitud');
            }

            setSuccess('¡Solicitud actualizada exitosamente!');

            // Redirigir después de 2 segundos
            setTimeout(() => {
                router.push(`/dashboard/requests/${requestId}`);
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Error al actualizar la solicitud. Por favor intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-100">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="text-center py-12">
                <FiX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Solicitud no encontrada</h3>
                <p className="text-gray-600 mb-6">La solicitud que buscas no existe o no tienes acceso.</p>
                <button
                    onClick={() => router.push('/dashboard/requests')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Volver a Mis Solicitudes
                </button>
            </div>
        );
    }

    // Filtrar archivos existentes que no están marcados para eliminar
    const existingAttachments = request.attachments.filter(
        att => !attachmentsToRemove.includes(att.url)
    );

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => router.push(`/dashboard/requests/${requestId}`)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <FiArrowLeft className="mr-2" />
                    Volver a la Solicitud
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Editar Solicitud</h1>
                <p className="text-gray-600 mt-2">
                    Actualiza la información de tu solicitud. Los cambios serán revisados por nuestro equipo.
                </p>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-6" />}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Información Básica */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <FiTag className="mr-2" />
                        Información de la Solicitud
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título de la Solicitud *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="Ej: Rediseño de logo para mi restaurante"
                                required
                                maxLength={100}
                            />
                            <p className="text-xs text-gray-500 mt-1">Sé específico y claro. Máximo 100 caracteres.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Servicio *
                            </label>
                            <select
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                required
                            >
                                {SERVICE_TYPES.map(service => (
                                    <option key={service.value} value={service.value}>
                                        {service.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción Detallada *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="Describe tu solicitud con el mayor detalle posible..."
                                required
                                maxLength={2000}
                            />
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-gray-500">
                                    {formData.description.length}/2000 caracteres
                                </p>
                                <p className="text-xs text-gray-500">
                                    Cuanto más detallado, mejor será el resultado
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Presupuesto (Opcional)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha Límite (Opcional)
                                </label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Referencias o Enlaces (Opcional)
                            </label>
                            <textarea
                                name="references"
                                value={formData.references}
                                onChange={handleInputChange}
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="Enlaces a sitios web, Behance, Dribbble, o descripciones de estilos que te gusten."
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.references.length}/500 caracteres
                            </p>
                        </div>
                    </div>
                </div>

                {/* Archivos Adjuntos */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <FiUpload className="mr-2" />
                        Archivos de Referencia
                    </h2>

                    <div className="space-y-8">
                        {/* Archivos existentes */}
                        {existingAttachments.length > 0 && (
                            <div>
                                <h3 className="font-medium text-gray-900 mb-4">
                                    Archivos actuales ({existingAttachments.length})
                                </h3>
                                <div className="space-y-3">
                                    {existingAttachments.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            <div className="flex items-center flex-1 min-w-0">
                                                <FiFileText className="text-gray-400 mr-3 shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">
                                                        {file.filename}
                                                    </p>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <span>{formatFileSize(file.size)}</span>
                                                        <span className="mx-2">•</span>
                                                        <span>{file.filetype}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeExistingAttachment(file.url)}
                                                className="ml-4 text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Archivos marcados para eliminar */}
                        {attachmentsToRemove.length > 0 && (
                            <div>
                                <h3 className="font-medium mb-4 text-red-600">
                                    Archivos que se eliminarán ({attachmentsToRemove.length})
                                </h3>
                                <div className="space-y-3">
                                    {request.attachments
                                        .filter(att => attachmentsToRemove.includes(att.url))
                                        .map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50"
                                            >
                                                <div className="flex items-center flex-1 min-w-0">
                                                    <FiFileText className="text-red-400 mr-3 shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-900 truncate line-through">
                                                            {file.filename}
                                                        </p>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <span>{formatFileSize(file.size)}</span>
                                                            <span className="mx-2">•</span>
                                                            <span>{file.filetype}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => restoreExistingAttachment(file.url)}
                                                    className="ml-4 text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition"
                                                >
                                                    Restaurar
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Nuevos archivos */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-4">
                                Agregar nuevos archivos
                            </h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition">
                                <FiImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-2 font-medium">
                                    Sube nuevos archivos de referencia
                                </p>
                                <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                                    Imágenes, documentos, logotipos actuales, o cualquier material adicional.
                                </p>

                                <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                                    <FiFile className="mr-2" />
                                    Seleccionar Archivos
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*,.pdf,.doc,.docx,.psd,.ai,.xd,.fig,.sketch,.zip,.rar"
                                    />
                                </label>

                                <p className="text-xs text-gray-500 mt-4">
                                    Tipos permitidos: Imágenes, PDF, documentos, archivos de diseño. Máximo 10MB por archivo.
                                </p>
                            </div>
                        </div>

                        {/* Lista de nuevos archivos */}
                        {newAttachments.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">
                                    Nuevos archivos seleccionados ({newAttachments.length})
                                </h3>

                                <div className="space-y-3">
                                    {newAttachments.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            <div className="flex items-center flex-1 min-w-0">
                                                <FiFileText className="text-gray-400 mr-3 shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">
                                                        {file.name}
                                                    </p>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <span>{formatFileSize(file.size)}</span>
                                                        <span className="mx-2">•</span>
                                                        <span>{file.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeNewAttachment(index)}
                                                className="ml-4 text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Previews de nuevas imágenes */}
                        {attachmentsPreview.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {attachmentsPreview.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img src={preview} alt="preview" className="w-full h-32 object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewAttachment(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <button
                        type="button"
                        onClick={() => router.push(`/dashboard/requests/${requestId}`)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto"
                        disabled={isSaving}
                    >
                        Cancelar
                    </button>

                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={() => {
                                // Resetear cambios
                                fetchRequest();
                                setNewAttachments([]);
                                attachmentsPreview.forEach(preview => URL.revokeObjectURL(preview));
                                setAttachmentsPreview([]);
                                setAttachmentsToRemove([]);
                            }}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            disabled={isSaving}
                        >
                            Descartar Cambios
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Guardando Cambios...
                                </>
                            ) : (
                                <>
                                    <FiSave className="mr-2" />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}