'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/app/lib/hooks/useAdmin';
import { FiPieChart, FiBarChart2, FiTrendingUp, FiDownload, FiCalendar } from 'react-icons/fi';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';

export default function AdminReportsPage() {
    const { fetchReports, loading } = useAdmin();
    const [reports, setReports] = useState<any>(null);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        loadReports();
    }, [dateRange]);

    const loadReports = async () => {
        try {
            const data = await fetchReports({
                startDate: dateRange.start,
                endDate: dateRange.end
            });
            setReports(data);
        } catch (error) {
            console.error('Error loading reports:', error);
        }
    };

    const exportToCSV = () => {
        // Función para exportar datos a CSV
        console.log('Exporting to CSV...');
    };

    const getMonthName = (month: number) => {
        const months = [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ];
        return months[month - 1] || '';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'requested': return 'Solicitado';
            case 'quoted': return 'Cotizado';
            case 'approved': return 'Aprobado';
            case 'in-progress': return 'En progreso';
            case 'review': return 'En revisión';
            case 'completed': return 'Completado';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    };

    const STATUS_CONFIG: Record<string, { label: string, classes: string }> = {
        requested: { label: 'Solicitado', classes: 'bg-gray-100 text-gray-800' },
        quoted: { label: 'Cotizado', classes: 'bg-yellow-100 text-yellow-800' },
        approved: { label: 'Aprobado', classes: 'bg-blue-100 text-blue-800' },
        'in-progress': { label: 'En Progreso', classes: 'bg-purple-100 text-purple-800' },
        review: { label: 'En Revisión', classes: 'bg-orange-100 text-orange-800' },
        completed: { label: 'Completado', classes: 'bg-green-100 text-green-800' },
        cancelled: { label: 'Cancelado', classes: 'bg-red-100 text-red-800' }
    };


    // Datos para gráficos
    const revenueData = reports?.financialStatsByMonth?.map((item: any) => ({
        name: `${getMonthName(item.month)} ${item.year}`,
        ingresos: item.revenue || 0,
        proyectos: item.count || 0
    })) || [];

    const projectStatusData = reports?.projectsByStatus?.map((item: any) => ({
        name: getStatusLabel(item.status),
        value: item.count
    })) || [];

    const getServiceTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            branding: 'Diseño de Marca',
            'ux-ui': 'Diseño UX/UI',
            graphic: 'Diseño Gráfico',
            web: 'Diseño Web',
            motion: 'Animación Gráfica',
            illustration: 'Ilustración',
            other: 'Otro',
        };
        return labels[type] || type;
    };

    const categoriesData = reports?.categoriesDistribution?.map((item: any) => ({
        // Transformamos el nombre antes de pasarlo al gráfico
        category: getServiceTypeLabel(item.category),
        count: item.count,
        revenue: item.revenue
    })) || [];

    const userGrowthData = reports?.usersByMonth?.reduce((acc: any[], item: any) => {
        const existing = acc.find(a => a.year === item.year && a.month === item.month);
        if (existing) {
            existing[item.role] = item.count;
        } else {
            const newItem = {
                name: `${getMonthName(item.month)} ${item.year}`,
                [item.role]: item.count
            };
            acc.push(newItem);
        }
        return acc;
    }, []) || [];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FiPieChart className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
                            <p className="text-gray-600 mt-1">
                                Análisis detallado del rendimiento de la plataforma
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                        <FiCalendar className="text-gray-400" />
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <span>a</span>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        <FiDownload className="mr-2" />
                        Exportar
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Generando reportes...</p>
                </div>
            ) : !reports ? (
                <div className="text-center py-12">
                    <FiPieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No hay datos</h3>
                    <p className="text-gray-500">No se encontraron datos para el período seleccionado.</p>
                </div>
            ) : (
                <>
                    {/* Resumen general */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Ingresos Totales (Revenue) */}
                        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                                    <FiTrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Ingresos Totales (Revenue)</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(reports.overview.totalRevenue || 0)}
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1 font-semibold">Flujo de caja total</p>
                                </div>
                            </div>
                        </div>

                        {/* Ganancia Neta (Profit) */}
                        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
                                    <FiBarChart2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Ganancia Neta (Profit)</p>
                                    <p className="text-2xl font-bold text-green-700">
                                        {/* Suponiendo que Profit = Revenue - Payouts */}
                                        {formatCurrency(reports.overview.totalProfit || (reports.overview.totalRevenue * 0.2))}
                                    </p>
                                    <p className="text-xs text-green-600 mt-1 font-semibold">Salud del negocio</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Proyectos */}
                        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mr-4">
                                    <FiBarChart2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Volumen de Proyectos</p>
                                    <p className="text-2xl font-bold text-gray-900">{reports.overview.totalProjects}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Activos: {
                                            reports.overview.totalProjects -
                                            (reports.projectsByStatus?.find((s: any) => s.status === 'completed')?.count || 0)
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ganancias Totales Históricas (Sustituye Tasa Crecimiento) */}
                        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
                            <div className="flex items-center">
                                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg mr-4">
                                    <FiPieChart className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Tickets Promedio</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(reports.overview.totalRevenue / (reports.overview.totalProjects || 1))}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Valor por proyecto</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Tendencia de Ingresos y Volumen */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Tendencia de Ingresos y Volumen</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    {/* Comentario: Cambiar a ComposedChart permite mezclar Barras y Líneas mejor */}
                                    <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="name"
                                            padding={{ left: 30, right: 30 }} // Evita que el punto flote solo en el centro
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            tickFormatter={(value) => `€${value}`}
                                            width={60}
                                            fontSize={12}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            domain={[0, 'auto']}
                                            fontSize={12}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            formatter={(value, name) => [
                                                name === 'ingresos' ? formatCurrency(Number(value)) : value,
                                                name === 'ingresos' ? 'Ingresos' : 'Proyectos'
                                            ]}
                                        />
                                        <Legend verticalAlign="bottom" height={36} />

                                        {/* Barras: Aumentamos el barSize para que se note aunque sea solo una */}
                                        <Bar
                                            yAxisId="right"
                                            dataKey="proyectos"
                                            fill="#94a3b8"
                                            opacity={0.4}
                                            name="Proyectos"
                                            barSize={40} // Grosor fijo para que no se vea una línea flaca
                                            radius={[4, 4, 0, 0]}
                                        />

                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="ingresos"
                                            stroke="#3b82f6"
                                            strokeWidth={4}
                                            dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 8 }}
                                            name="Ingresos"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Estado de Proyectos */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Distribución por Estado</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={projectStatusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.name}: ${entry.value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {projectStatusData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Distribución por Categorías */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Diseñadores */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Top 5 Diseñadores (Ingresos)</h3>
                            <div className="space-y-4">
                                {reports.topDesigners?.map((designer: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between border-b pb-2">
                                        <div className="flex items-center">
                                            <span className="w-6 text-red-400 font-bold">{index + 1}</span>
                                            <p className="text-sm font-medium text-gray-800">{designer.name}</p>
                                        </div>
                                        <span className="text-sm font-bold text-blue-600">
                                            {formatCurrency(Number(designer.totalEarnings) || 0)}
                                        </span>
                                    </div>
                                )) || <p className="text-gray-400 text-sm">No hay datos de diseñadores aún.</p>}
                            </div>
                        </div>

                        {/* Distribución por Categorías */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Demanda por Categoría</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoriesData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="category" type="category" width={100} fontSize={12} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

