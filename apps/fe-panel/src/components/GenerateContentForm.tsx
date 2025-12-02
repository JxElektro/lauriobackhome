'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faHourglass, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { triggerFlow } from '@/lib/api';

interface GenerateContentFormProps {
    onSuccess: () => void;
}

export default function GenerateContentForm({ onSuccess }: GenerateContentFormProps) {
    const [topics, setTopics] = useState<string>('');
    const [context, setContext] = useState<string>('Audiencia joven, tono cercano y práctico');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const topicList = topics.split('\n').filter(t => t.trim());

            if (topicList.length === 0) {
                throw new Error('Por favor ingresa al menos un tema');
            }

            const result = await triggerFlow(topicList, context);

            if (result.status === 'error') {
                setError(result.error || result.message);
            } else {
                setSuccess(result.message || `Se generaron ${result.createdItemsCount} items`);
                setTopics('');
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            }
        } catch (err: any) {
            setError(err.message || 'Error al generar contenido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="surface-card relative overflow-hidden p-6 md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-100/60 via-white/40 to-transparent" />
            <div className="relative flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm font-semibold text-brand-600">Generador semanal</p>
                    <h2 className="text-2xl md:text-3xl font-semibold leading-tight">Arma lotes curados en minutos</h2>
                    <p className="mt-2 text-sm text-ink-600 max-w-2xl">
                        Inyecta varios temas a la vez y deja que Laurio genere los bloques listos para reseñar,
                        validar y publicar.
                    </p>
                </div>
                <span className="pill bg-ink-900 text-white shadow-glow">IA asistida</span>
            </div>

            <form onSubmit={handleSubmit} className="relative mt-8 grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label htmlFor="topics" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                        <span className="h-2 w-2 rounded-full bg-brand-500" />
                        Temas (uno por línea)
                    </label>
                    <div className="mt-2 rounded-2xl bg-white/90 p-[1px] shadow-inner shadow-white/40">
                        <textarea
                            id="topics"
                            value={topics}
                            onChange={(e) => setTopics(e.target.value)}
                            placeholder="Impacto de la IA en trabajos junior&#10;Habilidades blandas para el primer empleo&#10;Errores comunes al buscar práctica profesional"
                            className="input-shell h-36 resize-none bg-transparent"
                            rows={4}
                            disabled={loading}
                        />
                    </div>
                    <p className="mt-2 text-xs text-ink-500">Tip: pega los temas desde tu research o backlog de marketing.</p>
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="context" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
                        <span className="h-2 w-2 rounded-full bg-orange-400" />
                        Contexto y tono
                    </label>
                    <div className="mt-2 rounded-2xl bg-white/90 p-[1px] shadow-inner shadow-white/40">
                        <input
                            id="context"
                            type="text"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            className="input-shell bg-transparent"
                            disabled={loading}
                            placeholder="Audiencia joven, tono cercano y práctico"
                        />
                    </div>
                    <p className="mt-2 text-xs text-ink-500">Usa tono, CTA clave o un marco (ej: PAS, enfoque educativo).</p>
                </div>

                {error && (
                    <div className="md:col-span-2 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-red-700 shadow-soft">
                        <FontAwesomeIcon icon={faCircleExclamation} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="md:col-span-2 flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50/80 px-4 py-3 text-green-700 shadow-soft">
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <span>{success}</span>
                    </div>
                )}

                <div className="md:col-span-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2 text-xs text-ink-500">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Guardamos cada bloque en el backlog para pulirlo antes de publicar.
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ink-900 via-ink-900 to-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:translate-y-[-1px] hover:shadow-xl disabled:translate-y-0 disabled:bg-slate-400 disabled:shadow-none"
                    >
                        {loading ? (
                            <>
                                <FontAwesomeIcon icon={faHourglass} />
                                <span>Generando contenido...</span>
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faRocket} />
                                <span>Generar Contenido</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
