'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/providers/AuthProvider';
import Alert from '@/components/ui/Alert';
import {
    FiArrowLeft, FiUpload, FiFile, FiImage,
    FiFileText, FiTag, FiInfo, FiSend
} from 'react-icons/fi';

const SERVICE_TYPES = [
    { value: 'branding', label: 'Branding & Identidad Visual' },
    { value: 'ux-ui', label: 'Diseño UX/UI' },
    { value: 'graphic', label: 'Diseño Gráfico' },
    { value: 'web', label: 'Diseño Web' },
    { value: 'motion', label: 'Motion Graphics' },
    { value: 'other', label: 'Otro tipo de proyecto' },
];

const FILE_TYPES = {
    'image/*': 'Imagen (JPG, PNG, GIF)',
    '.pdf': 'Documento PDF',
    '.doc,.docx': 'Documento Word',
    '.psd,.ai,.xd,.fig,.sketch': 'Archivos de diseño',
    '.zip,.rar': 'Archivo comprimido',
};

export default function NewProjectPage() {
    const router = useRouter();
    const { user } = useAuthContext();
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

        // Crear previews para imágenes
        const imagePreviews = newFiles
            .filter(file => file.type.startsWith('image/'))
            .map(file => URL.createObjectURL(file));

        setAttachmentsPreview(prev => [...prev, ...imagePreviews]);
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));

        // También eliminar el preview si existe
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

        // Validaciones básicas
        if (!formData.title.trim()) {
            setError('El título del proyecto es requerido');
            setIsLoading(false);
            return;
        }

        if (!formData.description.trim()) {
            setError('La descripción del proyecto es requerida');
            setIsLoading(false);
            return;
        }

        try {
            // Crear FormData para enviar archivos
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('serviceType', formData.serviceType);

            if (formData.budget !== '') {
                formDataToSend.append('budget', String(parseInt(formData.budget)));
            }

            if (formData.deadline) {
                formDataToSend.append('deadline', formData.deadline);
            }

            if (formData.references) {
                formDataToSend.append('references', formData.references);
            }

            // Agregar archivos
            attachments.forEach((file) => {
                formDataToSend.append('attachments', file);
            });

            const token = localStorage.getItem('token');
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al crear proyecto');
            }

            setSuccess('¡Proyecto creado exitosamente! Te redirigiremos en unos segundos...');

            // Redirigir después de 3 segundos
            setTimeout(() => {
                router.push('/dashboard/projects');
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'Error al crear el proyecto. Por favor intenta nuevamente.');
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
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <FiArrowLeft className="mr-2" />
                    Volver a Mis Proyectos
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Solicitar Nuevo Proyecto</h1>
                <p className="text-gray-600 mt-2">
                    Describe tu proyecto en detalle para que podamos entender tus necesidades y ofrecerte la mejor solución.
                </p>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-6" />}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Información Básica */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <FiTag className="mr-2" />
                        Información del Proyecto
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título del Proyecto *
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
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            budget: e.target.value,
                                        }))
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Ej: 3000"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Ingresa el monto en dólares (ejemplo: 3000).
                                </p>
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
                                Sube archivos de referencia para tu proyecto
                            </p>
                            <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                                Imágenes, documentos, logotipos actuales, o cualquier material que ayude a entender mejor tu proyecto.
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

                        {/* Lista de archivos seleccionados */}
                        {attachments.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">
                                    Archivos seleccionados ({attachments.length})
                                </h3>

                                <div className="space-y-3">
                                    {attachments.map((file, index) => (
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
                                                onClick={() => removeAttachment(index)}
                                                className="ml-4 text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Previews de imágenes */}
                        {attachmentsPreview.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">
                                    Vista previa de imágenes ({attachmentsPreview.length})
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {attachmentsPreview.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(index)}
                                                    className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all text-white bg-red-500 p-2 rounded-full"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                            <span><strong>Cotización personalizada:</strong> Te enviaremos un presupuesto detallado basado en tus requerimientos.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-bold mr-2">3.</span>
                            <span><strong>Aprobación y pago:</strong> Una vez aprobado el presupuesto, podrás realizar el pago inicial.</span>
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

                {/* Botones de acción */}
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
                            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Creando Proyecto...
                                </>
                            ) : (
                                <>
                                    <FiSend className="mr-2" />
                                    Solicitar Proyecto
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}