'use client';

import { BacklogItem } from '@laurio/shared';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faCamera, faImage, faMobileScreenButton, faBullseye } from '@fortawesome/free-solid-svg-icons';

interface BacklogTableProps {
    items: BacklogItem[];
    onItemClick: (id: string) => void;
}

export default function BacklogTable({ items, onItemClick }: BacklogTableProps) {
    if (items.length === 0) {
        return (
            <div className="surface-card text-center py-12">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 shadow-inner shadow-white/40">
                    <FontAwesomeIcon icon={faRocket} />
                </div>
                <p className="mt-4 text-lg font-semibold text-ink-900">No hay items en el backlog</p>
                <p className="mt-1 text-sm text-ink-600">Genera contenido con el formulario superior y aparecerá aquí al instante.</p>
            </div>
        );
    }

    const statusStyles: Record<string, string> = {
        idea: "bg-slate-50 text-ink-700 border border-slate-200",
        drafting: "bg-brand-50 text-brand-700 border border-brand-100",
        ready_for_review: "bg-amber-50 text-amber-700 border border-amber-100",
        approved: "bg-emerald-50 text-emerald-700 border border-emerald-100",
        posted: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    };

    const postTypeLabels: Record<string, JSX.Element> = {
        ig_carousel: (
            <span className="inline-flex items-center gap-2">
                <FontAwesomeIcon icon={faCamera} />
                <span>Carrusel</span>
            </span>
        ),
        ig_post: (
            <span className="inline-flex items-center gap-2">
                <FontAwesomeIcon icon={faImage} />
                <span>Post</span>
            </span>
        ),
        story_snippet: (
            <span className="inline-flex items-center gap-2">
                <FontAwesomeIcon icon={faMobileScreenButton} />
                <span>Story</span>
            </span>
        ),
    };

    const statusCopy: Record<string, string> = {
        idea: "Idea",
        drafting: "En redacción",
        ready_for_review: "Listo para revisar",
        approved: "Aprobado",
        posted: "Publicado",
    };

    return (
        <div className="grid gap-4">
            {items.map((item) => (
                <article
                    key={item.id}
                    onClick={() => onItemClick(item.id)}
                    className="group relative overflow-hidden surface-card cursor-pointer transition duration-200 hover:-translate-y-[2px] hover:shadow-glow"
                >
                    <div className="absolute right-0 top-0 h-28 w-28 -translate-y-1/2 translate-x-1/4 rotate-12 rounded-full bg-gradient-to-br from-brand-100/70 to-white/20 blur-2xl" />
                    <div className="relative flex flex-col gap-3 p-5 md:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.08em] text-ink-500">
                                    {new Date(item.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })} · {item.postType === "ig_carousel" ? "Carrusel" : "Publicación"}
                                </p>
                                <h3 className="mt-1 text-lg font-semibold text-ink-900">{item.topic}</h3>
                            </div>
                            <span
                                className={`pill ${statusStyles[item.status] || "bg-slate-100 text-ink-700 border border-slate-200"}`}
                            >
                                {statusCopy[item.status] || item.status.replace(/_/g, " ")}
                            </span>
                        </div>

                        <p className="text-sm text-ink-600">
                            {item.mainMessage || "Sin mensaje principal aún. Haz clic para completar los detalles."}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-ink-600">
                            <span className="pill bg-white/80 text-ink-800 border border-slate-200">
                                {postTypeLabels[item.postType] || item.postType}
                            </span>
                            <span className="pill bg-slate-100 text-ink-700 border border-slate-200 inline-flex items-center gap-2">
                                <FontAwesomeIcon icon={faBullseye} />
                                <span>Audiencia: {item.targetAudience}</span>
                            </span>
                            {item.notes ? (
                                <span className="pill bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    Nota agregada
                                </span>
                            ) : (
                                <span className="pill bg-orange-50 text-orange-700 border border-orange-100">
                                    Pendiente de notas
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="absolute inset-0 rounded-3xl border border-white/70 transition group-hover:border-brand-200/80" />
                </article>
            ))}
        </div>
    );
}
