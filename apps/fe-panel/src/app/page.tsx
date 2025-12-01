'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BacklogItem } from '@laurio/shared';
import { getBacklogItems } from '@/lib/api';
import BacklogTable from '@/components/BacklogTable';
import GenerateContentForm from '@/components/GenerateContentForm';

export default function Home() {
    const router = useRouter();
    const [items, setItems] = useState<BacklogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [postTypeFilter, setPostTypeFilter] = useState<string>('');

    useEffect(() => {
        loadItems();
    }, [statusFilter, postTypeFilter]);

    const loadItems = async () => {
        setLoading(true);
        try {
            const filters: any = {};
            if (statusFilter) filters.status = statusFilter;
            if (postTypeFilter) filters.postType = postTypeFilter;

            const data = await getBacklogItems(filters);
            setItems(data);
        } catch (error) {
            console.error('Error loading items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (id: string) => {
        router.push(`/backlog/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Laurio Content Backlog</h1>
                    <p className="mt-2 text-gray-600">Sistema de generación y gestión de contenido para Instagram</p>
                </div>

                {/* Generate Content Form */}
                <div className="mb-8">
                    <GenerateContentForm onSuccess={loadItems} />
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Filtrar por Estado
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Todos</option>
                                <option value="idea">Idea</option>
                                <option value="drafting">Borrador</option>
                                <option value="ready_for_review">Listo para Revisar</option>
                                <option value="approved">Aprobado</option>
                                <option value="posted">Publicado</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Filtrar por Tipo
                            </label>
                            <select
                                value={postTypeFilter}
                                onChange={(e) => setPostTypeFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Todos</option>
                                <option value="ig_carousel">Carrusel</option>
                                <option value="ig_post">Post</option>
                                <option value="story_snippet">Story</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Backlog Table */}
                {loading ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Cargando...</p>
                    </div>
                ) : (
                    <BacklogTable items={items} onItemClick={handleItemClick} />
                )}
            </div>
        </div>
    );
}
