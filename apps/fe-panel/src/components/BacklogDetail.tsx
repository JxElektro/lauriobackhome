'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BacklogItem } from '@laurio/shared';
import { getBacklogItem, updateBacklogItem } from '@/lib/api';

interface BacklogDetailProps {
    id: string;
}

const statusOptions = [
    { value: 'idea', label: 'Idea' },
    { value: 'drafting', label: 'Borrador' },
    { value: 'ready_for_review', label: 'Listo para Revisar' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'posted', label: 'Publicado' },
];

export default function BacklogDetail({ id }: BacklogDetailProps) {
    const router = useRouter();
    const [item, setItem] = useState<BacklogItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadItem();
    }, [id]);

    const loadItem = async () => {
        try {
            const data = await getBacklogItem(id);
            setItem(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!item) return;

        setSaving(true);
        try {
            await updateBacklogItem(id, {
                status: item.status,
                mainMessage: item.mainMessage,
                notes: item.notes,
            });
            alert('✅ Cambios guardados');
        } catch (err: any) {
            alert('❌ Error al guardar: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Cargando...</div>;
    }

    if (error || !item) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">Error: {error || 'Item no encontrado'}</p>
                <button
                    onClick={() => router.push('/')}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    ← Volver al listado
                </button>
            </div>
        );
    }

    const parseJSON = (data: any) => {
        if (!data) return null;
        if (typeof data === 'object') return data;
        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    };

    const structure = parseJSON(item.structure);
    const visualPrompts = parseJSON(item.visualPrompts);
    const sourceInsights = parseJSON(item.sourceInsights);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.push('/')}
                    className="text-blue-600 hover:underline"
                >
                    ← Volver
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            {/* Main Info */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h1 className="text-2xl font-bold">{item.topic}</h1>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                        </label>
                        <select
                            value={item.status}
                            onChange={(e) => setItem({ ...item, status: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Post
                        </label>
                        <input
                            type="text"
                            value={item.postType}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mensaje Principal
                    </label>
                    <textarea
                        value={item.mainMessage || ''}
                        onChange={(e) => setItem({ ...item, mainMessage: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={2}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas
                    </label>
                    <textarea
                        value={item.notes || ''}
                        onChange={(e) => setItem({ ...item, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                    />
                </div>
            </div>

            {/* Slides */}
            {structure?.slides && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Slides del Carrusel</h2>
                    <div className="space-y-3">
                        {structure.slides.map((slide: any, idx: number) => (
                            <div key={idx} className="border border-gray-200 rounded p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                        Slide {slide.id}
                                    </span>
                                    <span className="text-gray-500 text-sm">({slide.role})</span>
                                </div>
                                <p className="text-gray-700">{slide.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Visual Prompts */}
            {visualPrompts && Array.isArray(visualPrompts) && visualPrompts.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Prompts Visuales</h2>
                    <div className="space-y-3">
                        {visualPrompts.map((prompt: any, idx: number) => (
                            <div key={idx} className="border border-gray-200 rounded p-3">
                                <p className="text-sm text-gray-500 mb-1">
                                    {prompt.forSlide ? `Para slide ${prompt.forSlide}` : 'General'}
                                </p>
                                <p className="text-gray-700">{prompt.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Source Insights */}
            {sourceInsights && Array.isArray(sourceInsights) && sourceInsights.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Fuentes e Insights</h2>
                    <div className="space-y-3">
                        {sourceInsights.map((insight: any, idx: number) => (
                            <div key={idx} className="border border-gray-200 rounded p-3">
                                <a
                                    href={insight.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    {insight.sourceTitle}
                                </a>
                                <p className="text-gray-700 mt-2">{insight.summary}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
