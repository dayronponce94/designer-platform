import { FiBook, FiBriefcase, FiCalendar, FiExternalLink } from 'react-icons/fi';

export default function EducationExperience() {
    const education = [
        {
            degree: 'Licenciatura en Diseño Multimedia',
            period: '2019 – 2022',
            institution: 'Universidad de Beira Interior, Portugal',
            description: 'Formación integral en diseño digital y multimedia.'
        },
        {
            degree: 'Máster en Diseño y Desarrollo de Videojuegos',
            period: '2022 – 2024',
            institution: 'Universidad de Beira Interior, Portugal',
            description: 'Especialización en diseño 3D, narrativa interactiva y desarrollo de videojuegos.'
        },
        {
            degree: 'Doctorado en Diseño',
            period: '2025 – en curso',
            institution: 'Universidad de Lisíada, Porto',
            description: 'Investigación en diseño aplicado a narrativas culturales y nuevas tecnologías.'
        }
    ];

    const experiences = [
        {
            position: 'Diseñadora Gráfica',
            company: 'Croma, Porto, Portugal',
            period: 'Mayo 2025 – Julio 2025',
            description: 'Creación de contenido digital en diversos formatos. Diseño de sitios web, portadas, carruseles de imágenes y publicaciones para redes sociales. Desarrollo de newsletters y presentaciones corporativas.',
            link: null
        },
        {
            position: 'Creadora de Contenido Cultural e Investigadora en IA',
            company: 'Proyecto de Recuperación de Identidad Cultural',
            period: '2024 – 2025',
            description: 'Uso de la plataforma de IA de Bing para identificar, recuperar y promover aspectos de la identidad cultural.',
            link: 'https://heyzine.com/flip-book/01fbd4339b.html#page/18'
        },
        {
            position: 'Diseñadora 3D y Desarrolladora de Realidad Aumentada',
            company: 'Proyecto de Videojuego & Revista Caribe 360',
            period: '2023 – 2024',
            description: 'Desarrollo de personajes 3D para un videojuego utilizando Blender. Modelado y texturizado de personajes, asegurando compatibilidad con los requisitos del juego. Creación de la revista Caribe 360, incorporando realidad aumentada.',
            link: 'https://heyzine.com/flip-book/01fbd4339b.html#page/18'
        },
        {
            position: 'Diseñadora Gráfica Freelance',
            company: 'Trabajo remoto – Cuba',
            period: '2022 – 2024',
            description: 'Diseño de logotipo y servicios para un salón de belleza cubano (virtual). Colaboración con el cliente para reflejar la identidad visual deseada. Uso de herramientas como Adobe Photoshop.',
            link: null
        }
    ];

    return (
        <div className="space-y-12">
            {/* Formación Académica */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <FiBook className="mr-3 text-blue-600" />
                    Formación Académica
                </h2>
                <div className="space-y-6">
                    {education.map((edu, index) => (
                        <div
                            key={index}
                            className="relative pl-8 pb-6 border-l-2 border-blue-200 last:pb-0"
                        >
                            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-600"></div>
                            <div className="flex items-center mb-2">
                                <FiCalendar className="mr-2 text-gray-500" />
                                <span className="text-sm font-semibold text-blue-600">{edu.period}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{edu.degree}</h3>
                            <p className="text-gray-700 font-medium mb-2">{edu.institution}</p>
                            <p className="text-gray-600">{edu.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Experiencia Profesional */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <FiBriefcase className="mr-3 text-purple-600" />
                    Experiencia Profesional
                </h2>
                <div className="space-y-8">
                    {experiences.map((exp, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
                                    <p className="text-gray-700 font-medium">{exp.company}</p>
                                </div>
                                <div className="flex items-center mt-2 md:mt-0">
                                    <FiCalendar className="mr-2 text-gray-500" />
                                    <span className="text-sm font-semibold text-gray-600">{exp.period}</span>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-4">{exp.description}</p>
                            {exp.link && (
                                <a
                                    href={exp.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Ver publicación
                                    <FiExternalLink className="ml-2" />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Publicación Científica */}
            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Publicación Científica</h3>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Mapa Journal - 29 de enero de 2025</h4>
                        <p className="text-gray-700 italic">
                            "Personajes 3D y Migración Cubana en Caribe360: El Viaje de los Cisneros"
                        </p>
                        <p className="text-gray-600 mt-3">
                            Investigación sobre la representación de narrativas migratorias a través del diseño de personajes 3D y realidad aumentada.
                        </p>
                    </div>
                    <a
                        href="https://revistamapa.org/index.php/es/article/view/491"
                        className="mt-4 md:mt-0 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors inline-flex items-center justify-center"
                    >
                        Ver Publicación
                        <FiExternalLink className="ml-2" />
                    </a>
                </div>
            </div>
        </div>
    );
}