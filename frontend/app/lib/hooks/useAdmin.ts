import { useState, useCallback } from 'react';
import { adminAPI } from '../api/endpoints';
import { Project } from './useProjects';
import { Request } from '@/app/types/request';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'client' | 'designer' | 'admin';
    isActive: boolean;
    isVerified: boolean;
    company?: string;
    phone?: string;
    specialty?: string;
    experience?: number;
    bio?: string;
    skills?: string[];
    createdAt: string;
    updatedAt: string;
}


export interface ProjectAdmin extends Project {
    client: User;
    designer?: User;
}

export interface ReportData {
    overview: {
        totalUsers: number;
        totalClients: number;
        totalDesigners: number;
        totalProjects: number;
        totalRevenue: number;
        unassignedProjects: number;
    };
    projectsByStatus: Array<{
        status: string;
        count: number;
        totalBudget: number;
    }>;
    projectsByMonth: Array<{
        year: number;
        month: number;
        count: number;
        revenue: number;
    }>;
    usersByMonth: Array<{
        year: number;
        month: number;
        role: string;
        count: number;
    }>;
}

export function useAdmin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Gestión de usuarios
    const fetchUsers = useCallback(async (params?: any) => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllUsers(params);
            return response.data.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar usuarios');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleUserStatus = useCallback(async (userId: string, isActive: boolean) => {
        try {
            setLoading(true);
            const response = await adminAPI.updateUser(userId, { isActive });
            return response.data.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al actualizar usuario');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const verifyUser = useCallback(async (userId: string, isVerified: boolean) => {
        try {
            setLoading(true);
            const response = await adminAPI.updateUser(userId, { isVerified });
            return response.data.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al verificar usuario');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUserRole = useCallback(async (userId: string, role: string) => {
        try {
            setLoading(true);
            const response = await adminAPI.updateUser(userId, { role });
            return response.data.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al actualizar rol');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Gestión de proyectos
    const fetchProjects = useCallback(async (params?: any) => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllProjects(params);
            return response.data.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar proyectos');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const assignDesigner = useCallback(async (projectId: string, designerId: string) => {
        try {
            setLoading(true);
            const response = await adminAPI.assignDesigner(projectId, designerId);
            return response.data.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al asignar diseñador');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProjectStatus = useCallback(async (projectId: string, status: string, reason?: string) => {
        try {
            setLoading(true);
            const response = await adminAPI.updateProjectStatus(projectId, status, reason);
            return response.data.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al actualizar estado');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Reportes
    const fetchReports = useCallback(async (params?: any) => {
        try {
            setLoading(true);
            const response = await adminAPI.getReports(params);
            return response.data.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar reportes');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUser = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            const response = await adminAPI.deleteUser(userId);
            return response.data.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al eliminar usuario');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Agregar en el hook useAdmin
    const getDesignerPortfolio = useCallback(async (designerId: string) => {
        try {
            setLoading(true);
            const response = await adminAPI.getDesignerPortfolio(designerId);
            return response.data.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar el portafolio');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Gestión de solicitudes
    const fetchRequests = useCallback(async (params?: any) => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllRequests(params);
            return response.data.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar solicitudes');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateRequestStatus = useCallback(async (requestId: string, status: string, reason?: string) => {
        try {
            setLoading(true);
            const response = await adminAPI.updateRequestStatus(requestId, status, reason);
            return response.data.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al actualizar estado');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);



    return {
        loading,
        error,
        // Usuarios
        fetchUsers,
        toggleUserStatus,
        verifyUser,
        updateUserRole,
        deleteUser,
        // Proyectos
        fetchProjects,
        assignDesigner,
        updateProjectStatus,
        // Reportes
        fetchReports,
        // Portafolio de diseñador
        getDesignerPortfolio,
        //Solicitudes
        fetchRequests,
        updateRequestStatus,
    };
}