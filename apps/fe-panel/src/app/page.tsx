'use client';

import { useMemo, useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faBolt } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { BacklogItem } from '@laurio/shared';
import { getBacklogItems, triggerDailyMix } from '@/lib/api';
import BacklogTable from '@/components/BacklogTable';
import GenerateContentForm from '@/components/GenerateContentForm';

const parseMaybeJSON = (value: any) => {
    if (!value) return null;
    if (typeof value === 'object') return value;
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

export default function Home() {
    const router = useRouter();
    const [items, setItems] = useState<BacklogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [postTypeFilter, setPostTypeFilter] = useState<string>('');

    const loadItems = useCallback(async () => {
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
    }, [postTypeFilter, statusFilter]);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const handleDailyMix = async () => {
        const confirm = window.confirm('¿Generar mix diario de noticias? Esto creará 3 posts automáticos basados en noticias de hoy.');
        if (!confirm) return;

        setLoading(true);
        try {
            await triggerDailyMix();
            alert('Mix diario generado con éxito. Actualizando tablero...');
            loadItems();
        } catch (error) {
            alert('Error al generar mix diario');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (id: string) => {
        router.push(`/backlog/${id}`);
    };

    const stats = useMemo(() => {
        const total = items.length;
        const ready = items.filter((item) => item.status === 'ready_for_review').length;
        const approved = items.filter((item) => item.status === 'approved').length;
        const published = items.filter((item) => item.status === 'posted').length;
        const drafting = items.filter((item) => item.status === 'drafting' || item.status === 'idea').length;
        const completion = total ? Math.round((published / total) * 100) : 0;

        return [
            { label: 'Listos para revisar', value: ready, hint: 'Pasan al equipo de edición', accent: 'bg-amber-100 text-amber-800' },
            { label: 'Aprobados', value: approved, hint: 'Pulidos y validados', accent: 'bg-emerald-100 text-emerald-800' },
            { label: 'Publicados', value: published, hint: 'Live en Instagram', accent: 'bg-indigo-100 text-indigo-800' },
            { label: 'En ideación / redacción', value: drafting, hint: 'En progreso', accent: 'bg-brand-100 text-brand-800' },
            { label: 'Tasa de completitud', value: `${completion}%`, hint: 'vs backlog total', accent: 'bg-slate-100 text-ink-800' },
        ];
    }, [items]);

    const statusOptions = [
        { value: '', label: 'Todos' },
        { value: 'idea', label: 'Idea' },
        { value: 'drafting', label: 'Borrador' },
        { value: 'ready_for_review', label: 'Listo para revisar' },
        { value: 'approved', label: 'Aprobado' },
        { value: 'posted', label: 'Publicado' },
    ];

    const typeOptions = [
        { value: '', label: 'Todos' },
        { value: 'ig_carousel', label: 'Carrusel' },
        { value: 'ig_post', label: 'Post' },
        { value: 'story_snippet', label: 'Story' },
    ];

    const insightFeed = useMemo(() => {
        const insights = items.flatMap((item) => {
            const parsed = parseMaybeJSON(item.sourceInsights);
            if (Array.isArray(parsed)) {
                return parsed.map((insight: any) => ({ ...insight, topic: item.topic }));
            }
            return [];
        });
        return insights.slice(0, 4);
    }, [items]);

    const visualInspo = useMemo(() => {
        const visuals = items.flatMap((item) => {
            const parsed = parseMaybeJSON(item.visualPrompts);
            if (Array.isArray(parsed)) {
                return parsed.map((prompt: any) => ({
                    ...prompt,
                    topic: item.topic,
                }));
            }
            return [];
        });
        return visuals.slice(0, 3);
    }, [items]);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-ink-900">Panel de Control</h1>
                    <p className="text-sm text-ink-500">Resumen de tu operación de contenido.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDailyMix}
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-amber-950 shadow-lg shadow-amber-400/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <FontAwesomeIcon icon={faBolt} />
                        <span>Mix Diario</span>
                    </button>
                    <button
                        id="btn-new-batch"
                        onClick={() => router.push('/generate')}
                        className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ink-900/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <FontAwesomeIcon icon={faRocket} />
                        <span>Nuevo Lote</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div id="stats-grid" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md border border-slate-100"
                    >
                        <div className={`absolute right-0 top-0 h-16 w-16 -translate-y-1/2 translate-x-1/2 rounded-full opacity-10 ${stat.accent.split(' ')[0].replace('bg-', 'bg-')}`} />
                        <p className="text-xs font-medium text-ink-500">{stat.label}</p>
                        <p className="mt-1 text-2xl font-bold text-ink-900">{stat.value}</p>
                        <p className="mt-1 text-[10px] text-ink-400">{stat.hint}</p>
                    </div>
                ))}
            </div>

            {/* Content Feed Section */}
            <section className="grid gap-6 lg:grid-cols-[1.45fr,1fr]">
                <div className="space-y-4">
                    <div id="backlog-section" className="rounded-3xl bg-white p-1 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between px-4 py-3">
                            <h3 className="font-semibold text-ink-900">Backlog Reciente</h3>
                            <div className="flex gap-2">
                                <select 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="rounded-lg border-none bg-slate-50 px-3 py-1.5 text-xs font-medium text-ink-600 focus:ring-2 focus:ring-brand-500/20"
                                >
                                    {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="px-1 pb-1">
                            <BacklogTable items={items} loading={loading} onItemClick={handleItemClick} />
                        </div>
                    </div>
                </div>

                {/* Sidebar / Insights */}
                <div className="space-y-6">
                    {/* Visual Inspiration Feed */}
                    <div id="visual-feed" className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
                        <h3 className="mb-4 font-semibold text-ink-900">Prompts Visuales (Inspiración)</h3>
                        <div className="space-y-4">
                            {visualInspo.length > 0 ? (
                                visualInspo.map((prompt: any, i) => (
                                    <div key={i} className="group relative overflow-hidden rounded-xl bg-slate-900 p-4 text-white shadow-md transition-transform hover:scale-[1.01]">
                                        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-purple-600/20" />
                                        <p className="relative mb-2 text-[10px] font-bold uppercase tracking-wider opacity-60">
                                            {(prompt.topic || '').substring(0, 20)}...
                                        </p>
                                        <p className="relative text-xs leading-relaxed opacity-90">
                                            &quot;{(prompt.prompt || '').substring(0, 120)}...&quot;
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center">
                                    <p className="text-xs text-ink-400">Sin visuales aún</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Research Insights */}
                    <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
                        <h3 className="mb-4 font-semibold text-ink-900">Insights Detectados</h3>
                        <div className="space-y-3">
                            {insightFeed.length > 0 ? (
                                insightFeed.map((insight: any, i) => (
                                    <div key={i} className="rounded-xl bg-brand-50/50 p-3 transition-colors hover:bg-brand-50">
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-brand-600 uppercase">Source</span>
                                            {insight.sourceUrl && (
                                                <a href={insight.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-400 hover:underline">
                                                    Link ↗
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-xs font-medium text-ink-800 line-clamp-2">{insight.summary}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-xs text-ink-400 py-4">
                                    Genera contenido para ver insights
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
