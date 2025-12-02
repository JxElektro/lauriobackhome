'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBullseye } from '@fortawesome/free-solid-svg-icons';
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

    const loadItem = useCallback(async () => {
        try {
            const data = await getBacklogItem(id);
            setItem(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadItem();
    }, [id, loadItem]);

    const handleSave = async () => {
        if (!item) return;

        setSaving(true);
        try {
            await updateBacklogItem(id, {
                status: item.status,
                mainMessage: item.mainMessage,
                notes: item.notes,
            });
            alert('Cambios guardados');
        } catch (err: any) {
            alert('Error al guardar: ' + err.message);
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
                    className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Volver al listado</span>
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
    const primaryPrompt = Array.isArray(visualPrompts) ? visualPrompts[0] : null;
    const firstSlide = structure?.slides?.[0];

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="surface-card relative overflow-hidden p-4 sm:p-5">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-50 via-white/60 to-orange-50 opacity-70" />
                <div className="relative flex flex-wrap items-center justify-between gap-4">
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-ink-800 transition hover:-translate-y-[1px] hover:border-brand-200 hover:text-ink-900"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Volver</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="pill border border-slate-200 bg-white/80 text-ink-700">
                            {new Date(item.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })}
                        </span>
                        <span className="pill border border-ink-900 bg-ink-900 text-white shadow-glow">
                            {item.postType}
                        </span>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-ink-900 to-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-[1px] disabled:translate-y-0 disabled:bg-slate-400 disabled:shadow-none"
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="surface-card p-6">
                <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr] md:items-center">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.12em] text-ink-500">Previsualización rápida</p>
                        <h2 className="text-xl font-semibold text-ink-900">Copy + Look & Feel</h2>
                        <p className="text-sm text-ink-600">
                            Lo que verá el equipo de marketing al preparar la pieza. Ajusta texto o notas y valida el mood visual.
                        </p>
                        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-inner shadow-white/40">
                            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-700">Mensaje principal</p>
                            <p className="mt-1 text-lg font-semibold text-ink-900">{item.mainMessage || 'Define el mensaje clave para el carrusel/post'}</p>
                            {firstSlide && (
                                <p className="mt-2 text-sm text-ink-600">
                                    Slide 1 · <span className="font-semibold text-ink-800">{firstSlide.role}</span>: {firstSlide.text}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="pill border border-slate-200 bg-white/80 text-ink-700 inline-flex items-center gap-2"><FontAwesomeIcon icon={faBullseye} /><span>Audiencia: {item.targetAudience}</span></span>
                            <span className="pill border border-brand-200 bg-brand-50 text-brand-800">Tipo: {item.postType}</span>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-800 to-brand-700 p-6 text-white shadow-glow">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.18),transparent_20%)]" />
                        <div className="relative space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Moodboard</p>
                            <h3 className="text-2xl font-semibold">Visual prompt</h3>
                            <p className="text-sm text-white/80">
                                {primaryPrompt?.description || 'Genera un prompt visual para esta pieza: estilo, encuadre, iluminación y elementos clave.'}
                            </p>
                            <div className="rounded-2xl bg-white/10 p-4">
                                <p className="text-xs text-white/70">Resultado esperado</p>
                                <p className="text-sm font-semibold">
                                    {primaryPrompt?.forSlide ? `Enfocado en slide ${primaryPrompt.forSlide}` : 'Aplicable a todo el carrusel'}
                                </p>
                                <p className="mt-1 text-xs text-white/70">Listo para Midjourney / DALL·E</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="surface-card space-y-6 p-6">
                <div className="flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-[0.12em] text-ink-500">Topic</p>
                    <h1 className="text-2xl md:text-3xl font-semibold text-ink-900">{item.topic}</h1>
                    <p className="text-sm text-ink-600">Contexto, estatus y notas clave para guiar edición y publicación.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                            <span className="h-2 w-2 rounded-full bg-brand-500" />
                            Estado
                        </label>
                        <select
                            value={item.status}
                            onChange={(e) => setItem({ ...item, status: e.target.value as any })}
                            className="input-shell mt-2"
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                            <span className="h-2 w-2 rounded-full bg-orange-400" />
                            Tipo de Post
                        </label>
                        <input
                            type="text"
                            value={item.postType}
                            disabled
                            className="input-shell mt-2 bg-slate-50/80"
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            Mensaje Principal
                        </label>
                        <textarea
                            value={item.mainMessage || ''}
                            onChange={(e) => setItem({ ...item, mainMessage: e.target.value })}
                            className="input-shell mt-2 h-28 resize-none bg-white/90"
                            rows={2}
                        />
                        <p className="mt-2 text-xs text-ink-500">Resume la idea fuerza o CTA. Es lo que revisa primero el editor.</p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                            <span className="h-2 w-2 rounded-full bg-brand-500" />
                            Notas
                        </label>
                        <textarea
                            value={item.notes || ''}
                            onChange={(e) => setItem({ ...item, notes: e.target.value })}
                            className="input-shell mt-2 h-28 resize-none bg-white/90"
                            rows={3}
                        />
                        <p className="mt-2 text-xs text-ink-500">Agrega restricciones, referencias visuales o ajustes de tono.</p>
                    </div>
                </div>
            </div>

            {structure?.slides && (
                <div className="surface-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-ink-500">Slides del carrusel</p>
                            <h2 className="text-xl font-semibold text-ink-900">Narrativa slide a slide</h2>
                        </div>
                        <span className="pill border border-brand-200 bg-brand-50 text-brand-800">{structure.slides.length} slides</span>
                    </div>
                    <div className="mt-4 space-y-3">
                        {structure.slides.map((slide: any, idx: number) => (
                            <div key={idx} className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-inner shadow-white/40">
                                <div className="flex items-center gap-2">
                                    <span className="pill border border-brand-200 bg-brand-50 text-brand-800">Slide {slide.id}</span>
                                    <span className="text-xs text-ink-500">{slide.role}</span>
                                </div>
                                <p className="mt-2 text-sm text-ink-700">{slide.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {visualPrompts && Array.isArray(visualPrompts) && visualPrompts.length > 0 && (
                <div className="surface-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-ink-500">Prompts visuales</p>
                            <h2 className="text-xl font-semibold text-ink-900">Guía para creatividades</h2>
                        </div>
                        <span className="pill border border-orange-200 bg-orange-50 text-orange-800">{visualPrompts.length} indicaciones</span>
                    </div>
                    <div className="mt-4 space-y-3">
                        {visualPrompts.map((prompt: any, idx: number) => (
                            <div key={idx} className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-inner shadow-white/40">
                                <p className="text-xs text-ink-500">
                                    {prompt.forSlide ? `Para slide ${prompt.forSlide}` : 'General'}
                                </p>
                                <p className="mt-1 text-sm text-ink-700">{prompt.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {sourceInsights && Array.isArray(sourceInsights) && sourceInsights.length > 0 && (
                <div className="surface-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-ink-500">Fuentes e insights</p>
                            <h2 className="text-xl font-semibold text-ink-900">Research conectado</h2>
                        </div>
                        <span className="pill border border-emerald-200 bg-emerald-50 text-emerald-800">{sourceInsights.length} fuentes</span>
                    </div>
                    <div className="mt-4 space-y-3">
                        {sourceInsights.map((insight: any, idx: number) => (
                            <div key={idx} className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-inner shadow-white/40">
                                <a
                                    href={insight.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-700 hover:text-brand-800 font-semibold"
                                >
                                    {insight.sourceTitle}
                                </a>
                                <p className="mt-2 text-sm text-ink-700">{insight.summary}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
