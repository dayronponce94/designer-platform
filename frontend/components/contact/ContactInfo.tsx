import { FiMail, FiPhone, FiMapPin, FiGlobe, FiClock, FiUsers } from 'react-icons/fi';

export default function ContactInfo() {
    const contactInfo = {
        email: 'llerandi.design@gmail.com',
        phone: '+351 932 193 252',
        location: 'Porto, Portugal',
        languages: ['Español', 'Portugués', 'Inglés'],
        businessHours: {
            weekdays: '9:00 AM - 6:00 PM (GMT)',
            weekends: '10:00 AM - 2:00 PM (GMT)'
        },
        timezone: 'GMT (Portugal)'
    };

    const languages = [
        { code: 'es', name: 'Español', flag: '🇪🇸', level: 'Nativo' },
        { code: 'pt', name: 'Portugués', flag: '🇵🇹', level: 'Fluido' },
        { code: 'en', name: 'Inglés', flag: '🇬🇧', level: 'Avanzado' }
    ];

    return (
        <div className="space-y-8">
            {/* Información de contacto principal */}
            <div className="bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Información de Contacto Directo</h3>
                <div className="space-y-6">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                            <FiMail className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-white/80 text-sm">Email</div>
                            <a
                                href={`mailto:${contactInfo.email}`}
                                className="text-xl font-semibold hover:underline"
                            >
                                {contactInfo.email}
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                            <FiPhone className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-white/80 text-sm">Teléfono / WhatsApp</div>
                            <a
                                href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                                className="text-xl font-semibold hover:underline"
                            >
                                {contactInfo.phone}
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                            <FiMapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-white/80 text-sm">Ubicación Principal</div>
                            <div className="text-xl font-semibold">{contactInfo.location}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Idiomas */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FiGlobe className="mr-2 text-blue-600" />
                    Idiomas de Atención
                </h3>
                <div className="space-y-4">
                    {languages.map((lang) => (
                        <div key={lang.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">{lang.flag}</span>
                                <span className="font-medium text-gray-900">{lang.name}</span>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                {lang.level}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Horario de atención */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FiClock className="mr-2 text-green-600" />
                    Horario de Atención
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                            <div className="font-medium text-gray-900">Días de semana</div>
                            <div className="text-sm text-gray-600">Lunes a Viernes</div>
                        </div>
                        <div className="font-semibold text-green-700">{contactInfo.businessHours.weekdays}</div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                            <div className="font-medium text-gray-900">Fines de semana</div>
                            <div className="text-sm text-gray-600">Sábados</div>
                        </div>
                        <div className="font-semibold text-blue-700">{contactInfo.businessHours.weekends}</div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                        * Horarios en {contactInfo.timezone}. Disponible para reuniones con cita previa.
                    </div>
                </div>
            </div>

            {/* Equipo */}
            <div className="bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                    <FiUsers className="mr-2" />
                    Nuestro Equipo
                </h3>
                <p className="mb-6">
                    Contamos con diseñadores en diferentes zonas horarias para atenderte en tu idioma preferido.
                </p>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold">50+</div>
                        <div className="text-sm opacity-90">Diseñadores</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">24/7</div>
                        <div className="text-sm opacity-90">Soporte</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">3</div>
                        <div className="text-sm opacity-90">Idiomas</div>
                    </div>
                </div>
            </div>
        </div>
    );
}