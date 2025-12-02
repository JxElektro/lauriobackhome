'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GenerateContentForm from '@/components/GenerateContentForm';

export default function GeneratePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen pb-14">
            <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
                <div className="surface-card relative overflow-hidden p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white/70 to-orange-50 opacity-70" />
                    <div className="relative flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">Generar nuevo contenido</p>
                            <h1 className="text-3xl font-semibold text-ink-900">Lanzar nuevos lotes</h1>
                            <p className="text-sm text-ink-600">Agrupa temas, define tono y envía al backlog listo para revisión.</p>
                        </div>
                        <Link href="/backlog" className="pill border border-ink-900 bg-ink-900 text-white shadow-glow">
                            ← Backlog
                        </Link>
                    </div>
                </div>

                <div className="mt-8">
                    <GenerateContentForm onSuccess={() => router.push('/backlog')} />
                </div>
            </div>
        </div>
    );
}
