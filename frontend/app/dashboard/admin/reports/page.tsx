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
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
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
    const revenueData = reports?.projectsByMonth?.map((item: any) => ({
        name: `${getMonthName(item.month)} ${item.year}`,
        ingresos: item.revenue || 0,
        proyectos: item.count || 0
    })) || [];

    const projectStatusData = reports?.projectsByStatus?.map((item: any) => ({
        name: getStatusLabel(item.status),
        value: item.count
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
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                                    <FiTrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ingresos Totales</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(reports.overview.totalRevenue)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
                                    <FiBarChart2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Proyectos</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {reports.overview.totalProjects}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Sin asignar: {reports.overview.unassignedProjects}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mr-4">
                                    <FiPieChart className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Usuarios</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {reports.overview.totalUsers}
                                    </p>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Clientes: {reports.overview.totalClients} | Diseñadores: {reports.overview.totalDesigners}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg mr-4">
                                    <FiBarChart2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tasa de Crecimiento</p>
                                    <p className="text-2xl font-bold text-gray-900">+18%</p>
                                    <p className="text-xs text-gray-500 mt-1">Último mes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Ingresos vs Proyectos */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Ingresos vs Proyectos por Mes</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip
                                            formatter={(value) => [
                                                typeof value === 'number' ? formatCurrency(value) : value,
                                                ''
                                            ]}
                                        />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="ingresos" fill="#0088FE" name="Ingresos" />
                                        <Bar yAxisId="right" dataKey="proyectos" fill="#00C49F" name="Proyectos" />
                                    </BarChart>
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

                    {/* Crecimiento de usuarios */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Crecimiento de Usuarios</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={userGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="client" stroke="#8884d8" name="Clientes" />
                                    <Line type="monotone" dataKey="designer" stroke="#82ca9d" name="Diseñadores" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Tabla detallada */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Detalle por Estado de Proyectos</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Cantidad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Presupuesto Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Porcentaje
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reports.projectsByStatus.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_CONFIG[item.status]?.classes || 'bg-gray-100 text-gray-800'}`}>
                                                    {STATUS_CONFIG[item.status]?.label || item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatCurrency(item.totalBudget || 0)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {((item.count / reports.overview.totalProjects) * 100).toFixed(1)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

