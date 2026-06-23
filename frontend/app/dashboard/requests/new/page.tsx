'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@/components/ui/Alert';
import {
    FiArrowLeft,
    FiUpload,
    FiFile,
    FiImage,
    FiFileText,
    FiTag,
    FiInfo,
    FiSend,
    FiTrash2,
} from 'react-icons/fi';
import Link from 'next/dist/client/link';

const SERVICE_TYPES = [
    { value: 'branding', label: 'Diseño de Marca' },
    { value: 'ux-ui', label: 'Diseño UX/UI' },
    { value: 'graphic', label: 'Diseño Gráfico' },
    { value: 'web', label: 'Diseño Web' },
    { value: 'motion', label: 'Animación Gráfica' },
    { value: 'illustration', label: 'Ilustración' },
    { value: 'other', label: 'Otro tipo de proyecto' },
];

export default function NewRequestPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
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

    const [attachments, setAttachments] = useState<File[]>([]);
    const [attachmentsPreview, setAttachmentsPreview] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newFiles = Array.from(files);
        setAttachments(prev => [...prev, ...newFiles]);

        const imagePreviews = newFiles
            .filter(file => file.type.startsWith('image/'))
            .map(file => URL.createObjectURL(file));
        setAttachmentsPreview(prev => [...prev, ...imagePreviews]);
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
        if (attachmentsPreview[index]) {
            URL.revokeObjectURL(attachmentsPreview[index]);
            setAttachmentsPreview(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        if (!formData.title.trim()) {
            setError('El título es requerido');
            setIsLoading(false);
            return;
        }
        if (!formData.description.trim()) {
            setError('La descripción es requerida');
            setIsLoading(false);
            return;
        }

        try {
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

            attachments.forEach(file => {
                formDataToSend.append('attachments', file);
            });

            const token = localStorage.getItem('token');

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

            const response = await fetch(`${apiUrl}/requests`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formDataToSend
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al crear solicitud');

            setSuccess('¡Solicitud creada exitosamente! Redirigiendo...');
            setTimeout(() => router.push('/dashboard/requests'), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/dashboard/requests"
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <FiArrowLeft className="mr-2" />
                    Volver a Mis Solicitudes
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Nueva Solicitud</h1>
                <p className="text-gray-600 mt-2">
                    Describe tu idea con detalle para que podamos ofrecerte la mejor cotización.
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
                                Título *
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
                                placeholder="Describe tu proyecto con el mayor detalle posible. Incluye:
• Objetivos del proyecto
• Público objetivo
• Referencias o ejemplos que te gusten
• Colores preferidos
• Requisitos específicos"
                                required
                                maxLength={2000}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.description.length}/2000 caracteres
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Presupuesto (Opcional)
                                </label>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Ej: 3000"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Ingresa el monto en euros (ejemplo: 3000).
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha Límite Deseada (Opcional)
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
                                placeholder="Ej: 
• https://ejemplo.com/diseño-que-me-gusta
• https://behance.net/proyecto-inspirador
• Palabras clave: minimalista, moderno, profesional"
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enlaces a sitios web, Behance, Dribbble, o descripciones de estilos que te gusten.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Archivos Adjuntos */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <FiUpload className="mr-2" />
                        Archivos de Referencia (Opcional)
                    </h2>

                    <div className="space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition">
                            <FiImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2 font-medium">
                                Sube archivos de referencia (imágenes, documentos, etc.)
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

                        {attachments.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">
                                    Archivos seleccionados ({attachments.length})
                                </h3>
                                {attachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center flex-1 min-w-0">
                                            <FiFileText className="text-gray-400 mr-3 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                                                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(index)}
                                            className="text-red-500 hover:text-red-700 p-2"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {attachmentsPreview.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {attachmentsPreview.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img src={preview} alt="preview" className="w-full h-32 object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(index)}
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

                {/* Información del proceso */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                        <FiInfo className="mr-2" />
                        ¿Qué pasa después de solicitar el proyecto?
                    </h3>
                    <ol className="space-y-3 text-sm text-blue-700 ml-4">
                        <li className="flex items-start">
                            <span className="font-bold mr-2">1.</span>
                            <span><strong>Revisión de tu solicitud:</strong> Nuestro equipo revisará tu proyecto en 24-48 horas.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold mr-2">2.</span>
                            <span><strong>Cotización personalizada:</strong> Te enviaremos una cotización detallada basada en tus requerimientos.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold mr-2">3.</span>
                            <span><strong>Aprobación y pago:</strong> Una vez aprobada la cotización, podrás realizar el pago.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold mr-2">4.</span>
                            <span><strong>Asignación de diseñador:</strong> Te asignaremos el diseñador más adecuado para tu proyecto.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold mr-2">5.</span>
                            <span><strong>Seguimiento en tiempo real:</strong> Podrás ver el progreso y comunicarte con el diseñador desde tu dashboard.</span>
                        </li>
                    </ol>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>

                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={() => {
                                // Reset form
                                setFormData({
                                    title: '',
                                    description: '',
                                    serviceType: 'branding',
                                    budget: '',
                                    deadline: '',
                                    references: '',
                                });
                                setAttachments([]);
                                attachmentsPreview.forEach(preview => URL.revokeObjectURL(preview));
                                setAttachmentsPreview([]);
                            }}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            disabled={isLoading}
                        >
                            Limpiar Formulario
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <FiSend className="mr-2" />
                                    Enviar Solicitud
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}