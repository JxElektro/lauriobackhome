'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BacklogItem } from '@laurio/shared';
import { getBacklogItems } from '@/lib/api';
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
        <div className="min-h-screen pb-16">
            <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
                <section className="relative overflow-hidden surface-card p-6 md:p-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white/70 to-orange-50 opacity-70" />
                    <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-brand-100 blur-2xl" />
                    <div className="relative flex flex-col gap-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                                    <span className="h-[6px] w-[6px] rounded-full bg-brand-500" />
                                    Laurio Backoffice
                                </p>
                                <h1 className="mt-2 text-3xl sm:text-4xl font-semibold leading-tight text-ink-900">
                                    Operación creativa con IA: backlog, visuales y research a la mano
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm text-ink-600">
                                    Carga temas, recibe prompts visuales y revisa insights reales en un solo panel
                                    pensado para marketing. Todo queda listo para reseña o publicación.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-soft">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                <div>
                                    <p className="text-xs text-ink-500">Backlog sincronizado</p>
                                    <p className="text-sm font-semibold text-ink-900">{items.length || '0'} items activos</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-inner shadow-white/40 ring-1 ring-white/60"
                                >
                                    <div>
                                        <p className="text-xs text-ink-500">{stat.label}</p>
                                        <p className="text-xl font-semibold text-ink-900">{stat.value}</p>
                                        <p className="text-[11px] text-ink-500">{stat.hint}</p>
                                    </div>
                                    <span className={`pill ${stat.accent}`}>{stat.label.split(' ')[0]}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => router.push('/generate')}
                                className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-[1px]"
                            >
                                🚀 Crear lote IA
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/backlog')}
                                className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-5 py-3 text-sm font-semibold text-brand-800 hover:-translate-y-[1px]"
                            >
                                🎯 Ver temas activos
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const element = document.getElementById('visual-feed');
                                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-ink-800 hover:-translate-y-[1px]"
                            >
                                🖼️ Revisar prompts visuales
                            </button>
                        </div>
                    </div>
                </section>

                <section className="mt-8 grid gap-6 lg:grid-cols-[1.45fr,1fr]">
                    <div className="space-y-4">
                        <div className="surface-card p-4 sm:p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.12em] text-ink-500">Filtros rápidos</p>
                                    <h3 className="text-lg font-semibold text-ink-900">Enfoca el backlog</h3>
                                    <p className="text-sm text-ink-600">Aplica estados o tipo de pieza sin perder el contexto.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStatusFilter('');
                                        setPostTypeFilter('');
                                    }}
                                    className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                <div className="flex flex-wrap gap-2">
                                    {statusOptions.map((option) => {
                                        const active = statusFilter === option.value;
                                        return (
                                            <button
                                                type="button"
                                                key={option.value || 'all'}
                                                onClick={() => setStatusFilter(option.value)}
                                                className={`pill border ${active ? 'border-brand-300 bg-brand-50 text-brand-800 shadow-glow' : 'border-slate-200 bg-white/80 text-ink-700'} transition hover:-translate-y-[1px]`}
                                            >
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {typeOptions.map((option) => {
                                        const active = postTypeFilter === option.value;
                                        return (
                                            <button
                                                type="button"
                                                key={option.value || 'all-types'}
                                                onClick={() => setPostTypeFilter(option.value)}
                                                className={`pill border ${active ? 'border-ink-900 bg-ink-900 text-white shadow-glow' : 'border-slate-200 bg-white/80 text-ink-700'} transition hover:-translate-y-[1px]`}
                                            >
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="surface-card flex flex-col items-center justify-center gap-3 py-12">
                                <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-200 border-b-brand-600" />
                                <p className="text-sm text-ink-600">Cargando backlog...</p>
                            </div>
                        ) : (
                            <BacklogTable items={items} onItemClick={handleItemClick} />
                        )}
                    </div>

                    <div className="lg:sticky lg:top-6 space-y-4">
                        <GenerateContentForm onSuccess={loadItems} />

                        <div id="visual-feed" className="surface-card p-5">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.12em] text-ink-500">Prompts visuales</p>
                                    <h3 className="text-lg font-semibold text-ink-900">Guía para imagen / video</h3>
                                    <p className="text-sm text-ink-600">Saca quick wins para Midjourney o DALL·E basados en los temas reales.</p>
                                </div>
                                <span className="pill border border-slate-200 bg-white/80 text-ink-700">{visualInspo.length || 0} ideas</span>
                            </div>
                            <div className="mt-3 space-y-3">
                                {visualInspo.length === 0 ? (
                                    <p className="text-sm text-ink-600">Aún no hay prompts visuales. Genera contenido para ver sugerencias.</p>
                                ) : (
                                    visualInspo.map((prompt, idx) => (
                                        <div key={idx} className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-inner shadow-white/40">
                                            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-700">Tema: {prompt.topic}</p>
                                            <p className="mt-1 text-sm text-ink-700">{prompt.description}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="surface-card p-5">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.12em] text-ink-500">Insights reales</p>
                                    <h3 className="text-lg font-semibold text-ink-900">Fuentes curadas</h3>
                                    <p className="text-sm text-ink-600">Enlaces y resúmenes que respaldan las piezas del backlog.</p>
                                </div>
                                <span className="pill border border-emerald-200 bg-emerald-50 text-emerald-800">{insightFeed.length || 0} fuentes</span>
                            </div>
                            <div className="mt-3 space-y-3">
                                {insightFeed.length === 0 ? (
                                    <p className="text-sm text-ink-600">Genera contenido para poblar el feed de research.</p>
                                ) : (
                                    insightFeed.map((insight, idx) => (
                                        <div key={idx} className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-inner shadow-white/40">
                                            <a
                                                href={insight.sourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                                            >
                                                {insight.sourceTitle}
                                            </a>
                                            <p className="text-xs text-ink-500">Tema: {insight.topic}</p>
                                            <p className="mt-1 text-sm text-ink-700">{insight.summary}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
