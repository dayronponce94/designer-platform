'use client';

import { useState } from 'react';
import { FiGlobe, FiUsers, FiMessageSquare, FiTarget, FiClock, FiStar } from 'react-icons/fi';

export default function SkillsSection() {
    const [activeTab, setActiveTab] = useState<'skills' | 'languages'>('skills');

    const skills = [
        { name: 'Gestión del estrés y del tiempo', level: 90 },
        { name: 'Comunicación', level: 95 },
        { name: 'Trabajo en equipo', level: 90 },
        { name: 'Adaptabilidad', level: 85 },
        { name: 'Resolución de problemas', level: 88 }
    ];

    const languages = [
        { name: 'Español', level: 100, stars: 5, proficiency: 'Nativo' },
        { name: 'Portugués', level: 80, stars: 4, proficiency: 'Fluido' },
        { name: 'Inglés', level: 60, stars: 3, proficiency: 'Intermedio' }
    ];

    const softSkills = [
        { icon: <FiUsers />, name: 'Trabajo en equipo', description: 'Colaboración efectiva' },
        { icon: <FiMessageSquare />, name: 'Comunicación', description: 'Clara y asertiva' },
        { icon: <FiTarget />, name: 'Resolución de problemas', description: 'Enfoque creativo' },
        { icon: <FiClock />, name: 'Gestión del tiempo', description: 'Organización eficiente' }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
            {/* Pestañas */}
            <div className="flex border-b border-gray-200 mb-8">
                <button
                    className={`flex-1 py-3 font-semibold text-center ${activeTab === 'skills'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    onClick={() => setActiveTab('skills')}
                >
                    Habilidades
                </button>
                <button
                    className={`flex-1 py-3 font-semibold text-center ${activeTab === 'languages'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    onClick={() => setActiveTab('languages')}
                >
                    Idiomas
                </button>
            </div>

            {/* Contenido de Habilidades */}
            {activeTab === 'skills' && (
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Habilidades Profesionales</h3>
                    <div className="space-y-6">
                        {skills.map((skill) => (
                            <div key={skill.name}>
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-gray-700">{skill.name}</span>
                                    <span className="text-blue-600 font-semibold">{skill.level}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-linear-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
                                        style={{ width: `${skill.level}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Soft Skills con iconos */}
                    <div className="mt-8">
                        <h4 className="text-lg font-bold text-gray-900 mb-4">Soft Skills</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {softSkills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center p-4 bg-blue-50 rounded-xl"
                                >
                                    <div className="text-blue-600 text-2xl mb-2">{skill.icon}</div>
                                    <span className="font-medium text-gray-700 text-center">{skill.name}</span>
                                    <span className="text-sm text-gray-600 text-center">{skill.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Contenido de Idiomas */}
            {activeTab === 'languages' && (
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <FiGlobe className="mr-2" />
                        Idiomas
                    </h3>
                    <div className="space-y-6">
                        {languages.map((lang) => (
                            <div key={lang.name}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-gray-700">{lang.name}</span>
                                    <span className="text-blue-600 font-semibold">{lang.proficiency}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex mr-4">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                className={`w-5 h-5 ${i < lang.stars
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">{lang.level}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                    <div
                                        className="bg-linear-to-r from-green-500 to-teal-500 h-2.5 rounded-full"
                                        style={{ width: `${lang.level}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tecnologías y Herramientas */}
            <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Herramientas Dominadas</h4>
                <div className="flex flex-wrap gap-2">
                    {['Adobe Photoshop', 'Adobe Illustrator', 'Blender', 'Figma', 'Adobe After Effects', 'HTML/CSS', 'React', 'Next.js'].map((tool) => (
                        <span
                            key={tool}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                            {tool}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}