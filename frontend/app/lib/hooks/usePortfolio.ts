import { useState, useEffect, useCallback } from 'react';
import { portfolioAPI } from '../api/endpoints';

export interface PortfolioItem {
    _id: string;
    designerId: {
        _id: string;
        name: string;
        specialty: string;
        experience: number;
        bio?: string;
        skills?: string[];
    };
    title: string;
    description: string;
    category: 'branding' | 'ux-ui' | 'graphic' | 'web' | 'motion' | 'illustration' | 'other';
    tags: string[];
    images: Array<{
        _id?: string;
        url: string;
        filename: string;
        isThumbnail: boolean;
        uploadedAt: string;
    }>;
    clientName?: string;
    projectDate?: string;
    tools: string[];
    createdAt: string;
    updatedAt: string;
}

export interface UsePortfolioReturn {
    items: PortfolioItem[];
    item: PortfolioItem | null;
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    fetchPortfolio: (params?: any) => Promise<void>;
    fetchMyPortfolio: (params?: any) => Promise<void>;
    fetchPortfolioItem: (id: string) => Promise<void>;
    createPortfolioItem: (data: any) => Promise<PortfolioItem>;
    updatePortfolioItem: (id: string, data: any) => Promise<PortfolioItem>;
    deletePortfolioItem: (id: string) => Promise<void>;
    uploadImages: (files: File[]) => Promise<any>;
}

export function usePortfolio(): UsePortfolioReturn {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [item, setItem] = useState<PortfolioItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
    });

    const fetchPortfolio = useCallback(async (params?: any) => {
        try {
            setLoading(true);
            const response = await portfolioAPI.getPortfolio(params);
            setItems(response.data.message.items);
            setPagination(response.data.message.pagination);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar el portafolio');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMyPortfolio = useCallback(async (params?: any) => {
        try {
            setLoading(true);
            const response = await portfolioAPI.getMyPortfolio(params);
            setItems(response.data.message.items);
            setPagination(response.data.message.pagination);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar tu portafolio');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPortfolioItem = useCallback(async (id: string) => {
        try {
            setLoading(true);
            const response = await portfolioAPI.getPortfolioItem(id);
            setItem(response.data.message);
            setError(null);
        } catch (err: any) {
            if (err.response?.status === 404) {
                // No encontrado → no es error, simplemente no hay item
                setItem(null);
                setError(null);
            } else {
                setError(err.response?.data?.message || 'Error al cargar el item del portafolio');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const createPortfolioItem = useCallback(async (data: any) => {
        try {
            const response = await portfolioAPI.createPortfolioItem(data);
            return response.data.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Error al crear el item del portafolio');
        }
    }, []);

    const updatePortfolioItem = useCallback(async (id: string, data: any) => {
        try {
            const response = await portfolioAPI.updatePortfolioItem(id, data);
            return response.data.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Error al actualizar el item del portafolio');
        }
    }, []);

    const deletePortfolioItem = useCallback(async (id: string) => {
        try {
            await portfolioAPI.deletePortfolioItem(id);
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Error al eliminar el item del portafolio');
        }
    }, []);

    const uploadImages = useCallback(async (files: File[]) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');
            const allUploadedImages: any[] = [];

            // Iteramos de manera secuencial para evitar desbordes en el protocolo HTTP2 de la nube
            for (const file of files) {
                const formData = new FormData();
                formData.append('images', file); // Asegúrate de mantener la clave 'images' que espera tu backend

                const response = await fetch(`${apiUrl}/portfolio/upload-images`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error en el servidor al subir una de las imágenes');
                }

                const result = await response.json();

                // Mapeamos el resultado tal cual lo entregaba tu API masiva original
                if (result.data?.message?.images) {
                    allUploadedImages.push(...result.data.message.images);
                } else if (result.data?.images) {
                    allUploadedImages.push(...result.data.images);
                } else if (result.message?.images) {
                    allUploadedImages.push(...result.message.images);
                }
            }

            return allUploadedImages;
        } catch (err: any) {
            throw new Error(err.message || 'Error al subir las imágenes');
        }
    }, []);

    return {
        items,
        item,
        loading,
        error,
        pagination,
        fetchPortfolio,
        fetchMyPortfolio,
        fetchPortfolioItem,
        createPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        uploadImages
    };
}