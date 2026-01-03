'use client';

import { useState } from 'react';
import { FiCheck, FiX, FiHelpCircle } from 'react-icons/fi';

const plans = [
    {
        name: 'Básico',
        description: 'Perfecto para proyectos pequeños y freelancers',
        monthlyPrice: '€299',
        yearlyPrice: '€287/mes',
        yearlyTotal: '€3,444',
        color: 'from-blue-500 to-cyan-500',
        features: [
            { text: '1 proyecto activo simultáneo', included: true },
            { text: 'Hasta 3 revisiones por proyecto', included: true },
            { text: 'Acceso a diseñadores junior', included: true },
            { text: 'Soporte por email (48h)', included: true },
            { text: 'Diseñador senior dedicado', included: false },
            { text: 'Revisiones ilimitadas', included: false },
            { text: 'Gestor de proyectos asignado', included: false },
            { text: 'Soporte prioritario 24/7', included: false }
        ],
        cta: 'Comenzar Prueba Gratis',
        popular: false
    },
    {
        name: 'Profesional',
        description: 'Para empresas en crecimiento y proyectos complejos',
        monthlyPrice: '€799',
        yearlyPrice: '€639/mes',
        yearlyTotal: '€7,668',
        color: 'from-purple-500 to-pink-500',
        features: [
            { text: '3 proyectos activos simultáneos', included: true },
            { text: 'Hasta 5 revisiones por proyecto', included: true },
            { text: 'Acceso a diseñadores senior', included: true },
            { text: 'Soporte por chat (24h)', included: true },
            { text: 'Diseñador senior dedicado', included: true },
            { text: 'Revisiones ilimitadas', included: false },
            { text: 'Gestor de proyectos asignado', included: true },
            { text: 'Soporte prioritario 24/7', included: false }
        ],
        cta: 'Elegir Plan Profesional',
        popular: true
    },
    {
        name: 'Empresa',
        description: 'Para grandes corporaciones y agencias',
        monthlyPrice: '€1,499',
        yearlyPrice: '€1,199/mes',
        yearlyTotal: '€14,388',
        color: 'from-orange-500 to-red-500',
        features: [
            { text: 'Proyectos ilimitados activos', included: true },
            { text: 'Revisiones ilimitadas', included: true },
            { text: 'Equipo dedicado de diseñadores', included: true },
            { text: 'Soporte telefónico prioritario', included: true },
            { text: 'Diseñador senior dedicado', included: true },
            { text: 'Gestor de proyectos asignado', included: true },
            { text: 'Dashboard de reporting avanzado', included: true },
            { text: 'Soporte 24/7 con SLA garantizado', included: true }
        ],
        cta: 'Contactar Ventas',
        popular: false
    }
];

const designerPlans = [
    {
        name: 'Diseñador Freelance',
        description: 'Para profesionales independientes',
        price: 'Gratis',
        commission: '15% por proyecto',
        features: [
            'Acceso a proyectos de clientes',
            'Perfil profesional público',
            'Herramientas de gestión básicas',
            'Soporte de la comunidad'
        ],
        color: 'from-green-500 to-teal-500'
    },
    {
        name: 'Agencia Partner',
        description: 'Para estudios de diseño establecidos',
        price: '€199/mes',
        commission: '8% por proyecto',
        features: [
            'Acceso prioritario a proyectos',
            'Dashboard de equipo completo',
            'Branding de agencia destacado',
            'Soporte dedicado 24/7',
            'Formación y certificaciones'
        ],
        color: 'from-indigo-500 to-purple-500'
    }
];

export default function PricingPlans() {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
    const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Toggle de facturación */}
                <div className="flex justify-center mb-16">
                    <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
                        <button
                            onClick={() => setBillingPeriod('monthly')}
                            className={`px-8 py-3 rounded-full font-semibold transition-all ${billingPeriod === 'monthly'
                                ? 'bg-white text-gray-900 shadow-lg'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Mensual
                        </button>
                        <button
                            onClick={() => setBillingPeriod('yearly')}
                            className={`px-8 py-3 rounded-full font-semibold transition-all relative ${billingPeriod === 'yearly'
                                ? 'bg-white text-gray-900 shadow-lg'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Anual
                            <span className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                -20%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Planes para Clientes */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Planes para Clientes
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Elige el nivel de servicio que mejor se adapte a tus necesidades de diseño
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={plan.name}
                                className={`relative rounded-2xl border-2 transition-all duration-300 ${plan.popular
                                    ? 'border-purple-500 shadow-2xl transform -translate-y-2'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onMouseEnter={() => setHoveredPlan(index)}
                                onMouseLeave={() => setHoveredPlan(null)}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full">
                                        Más Popular
                                    </div>
                                )}

                                <div className="p-8">
                                    {/* Cabecera del plan */}
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {plan.name}
                                        </h3>
                                        <p className="text-gray-600">{plan.description}</p>
                                    </div>

                                    {/* Precio */}
                                    <div className="mb-8">
                                        <div className="flex items-baseline">
                                            <span className="text-5xl font-bold text-gray-900">
                                                {billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                                            </span>
                                            {billingPeriod === 'monthly' && (
                                                <span className="text-gray-600 ml-2">/mes</span>
                                            )}
                                        </div>
                                        {billingPeriod === 'yearly' && (
                                            <div className="text-gray-600 mt-2">
                                                Facturado anualmente: {plan.yearlyTotal}
                                            </div>
                                        )}
                                    </div>

                                    {/* Características */}
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center">
                                                {feature.included ? (
                                                    <FiCheck className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                                                ) : (
                                                    <FiX className="w-5 h-5 text-gray-300 mr-3 shrink-0" />
                                                )}
                                                <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                                                    {feature.text}
                                                </span>
                                                {idx === 3 && (
                                                    <FiHelpCircle className="w-4 h-4 text-gray-400 ml-2 cursor-help" />
                                                )}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <button
                                        className={`w-full py-4 font-bold rounded-xl transition-all duration-300 ${plan.popular
                                            ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white hover:shadow-2xl'
                                            : 'bg-linear-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                                            }`}
                                    >
                                        {plan.cta}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Planes para Diseñadores */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Planes para Diseñadores
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Únete a nuestra red de talento y accede a proyectos de calidad
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {designerPlans.map((plan) => (
                            <div
                                key={plan.name}
                                className="rounded-2xl border-2 border-gray-200 hover:border-gray-300 p-8 transition-all duration-300"
                            >
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-gray-600">{plan.description}</p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline">
                                        <span className="text-5xl font-bold text-gray-900">
                                            {plan.price}
                                        </span>
                                        {plan.price !== 'Gratis' && (
                                            <span className="text-gray-600 ml-2">/mes</span>
                                        )}
                                    </div>
                                    <div className="text-gray-600 mt-2">
                                        Comisión: {plan.commission}
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-gray-700">
                                            <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className="w-full py-4 bg-linear-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300">
                                    {plan.price === 'Gratis' ? 'Registrarse Gratis' : 'Convertirse en Partner'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comparativa de características */}
                <div className="bg-gray-50 rounded-2xl p-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Comparativa Detallada
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-4 font-semibold text-gray-900">
                                        Característica
                                    </th>
                                    {plans.map((plan) => (
                                        <th key={plan.name} className="text-center py-4 font-semibold text-gray-900">
                                            {plan.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {plans[0].features.map((_, idx) => (
                                    <tr key={idx} className="border-b border-gray-100">
                                        <td className="py-4 text-gray-700">
                                            {plans[0].features[idx].text}
                                        </td>
                                        {plans.map((plan) => (
                                            <td key={plan.name} className="text-center py-4">
                                                {plan.features[idx].included ? (
                                                    <FiCheck className="w-5 h-5 text-green-500 mx-auto" />
                                                ) : (
                                                    <FiX className="w-5 h-5 text-gray-300 mx-auto" />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}