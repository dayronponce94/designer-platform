'use client';

import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiMessageSquare } from 'react-icons/fi';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
        budget: '',
        timeline: '',
        agreePrivacy: false
    });

    const services = [
        'Branding Corporativo',
        'UX/UI Design',
        'Diseño Web',
        'App Design',
        'Diseño Gráfico',
        'Packaging',
        'Marketing Digital',
        'Motion Graphics',
        'No estoy seguro',
        'Otro'
    ];

    const budgets = [
        'Menos de €1,000',
        '€1,000 - €3,000',
        '€3,000 - €5,000',
        '€5,000 - €10,000',
        'Más de €10,000',
        'Por definir'
    ];

    const timelines = [
        'Urgente (1-2 semanas)',
        'Pronto (2-4 semanas)',
        'Normal (1-2 meses)',
        'Flexible (más de 2 meses)'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Aquí iría la lógica de envío real
        alert('¡Mensaje enviado! Nos pondremos en contacto contigo en 24 horas.');
        setFormData({
            name: '',
            email: '',
            phone: '',
            company: '',
            service: '',
            message: '',
            budget: '',
            timeline: '',
            agreePrivacy: false
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div id="formulario" className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Envíanos un mensaje
            </h2>
            <p className="text-gray-600 mb-8">
                Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre completo *
                        </label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition"
                                placeholder="Tu nombre"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono
                        </label>
                        <div className="relative">
                            <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition"
                                placeholder="+351 912 345 678"
                            />
                        </div>
                    </div>

                    {/* Empresa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Empresa
                        </label>
                        <div className="relative">
                            <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition"
                                placeholder="Nombre de tu empresa"
                            />
                        </div>
                    </div>
                </div>

                {/* Servicio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        ¿Qué servicio te interesa? *
                    </label>
                    <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition appearance-none bg-white"
                        required
                    >
                        <option value="">Selecciona un servicio</option>
                        {services.map((service) => (
                            <option key={service} value={service}>
                                {service}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Presupuesto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Presupuesto aproximado
                        </label>
                        <select
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition appearance-none bg-white"
                        >
                            <option value="">Selecciona un rango</option>
                            {budgets.map((budget) => (
                                <option key={budget} value={budget}>
                                    {budget}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Timeline */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timeline del proyecto
                        </label>
                        <select
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition appearance-none bg-white"
                        >
                            <option value="">Selecciona un timeline</option>
                            {timelines.map((timeline) => (
                                <option key={timeline} value={timeline}>
                                    {timeline}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Mensaje */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cuéntanos sobre tu proyecto *
                    </label>
                    <div className="relative">
                        <FiMessageSquare className="absolute left-3 top-4 text-gray-400" />
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={6}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition resize-none"
                            placeholder="Describe tu proyecto, objetivos, audiencia y cualquier detalle relevante..."
                            required
                        />
                    </div>
                </div>

                {/* Privacidad */}
                <div>
                    <label className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                type="checkbox"
                                name="agreePrivacy"
                                checked={formData.agreePrivacy}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500/30"
                                required
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <span className="text-gray-700">
                                He leído y acepto la{' '}
                                <a href="/privacy" className="text-blue-600 hover:underline font-medium">
                                    Política de Privacidad
                                </a>
                                . *
                            </span>
                        </div>
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                    Enviar Mensaje
                </button>
            </form>
        </div>
    );
}