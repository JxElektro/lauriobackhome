'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBacklogItems } from '@/lib/api';
import { BacklogItem } from '@laurio/shared';
import Link from 'next/link';
import BacklogTable from '@/components/BacklogTable';

export default function BacklogPage() {
    const [items, setItems] = useState<BacklogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchItems() {
            try {
                const data = await getBacklogItems();
                setItems(data);
            } catch (err) {
                setError('Failed to load backlog items');
            } finally {
                setLoading(false);
            }
        }
        fetchItems();
    }, []);

    return (
        <div className="min-h-screen pb-12">
            <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
                <div className="surface-card relative overflow-hidden p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white/70 to-orange-50 opacity-70" />
                    <div className="relative flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">Backlog detallado</p>
                            <h1 className="text-3xl font-semibold text-ink-900">Todas las piezas en cola</h1>
                            <p className="text-sm text-ink-600">Explora el backlog completo sin filtros, ideal para auditorías rápidas.</p>
                        </div>
                        <Link
                            href="/"
                            className="pill border border-ink-900 bg-ink-900 text-white shadow-glow"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>

                <div className="mt-6">
                    {loading ? (
                        <div className="surface-card flex flex-col items-center justify-center gap-3 py-12">
                            <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-200 border-b-brand-600" />
                            <p className="text-sm text-ink-600">Cargando backlog...</p>
                        </div>
                    ) : error ? (
                        <div className="surface-card border border-red-200 bg-red-50/80 p-6 text-red-700">
                            {error}
                        </div>
                    ) : (
                        <BacklogTable items={items} onItemClick={(id) => router.push(`/backlog/${id}`)} />
                    )}
                </div>
            </div>
        </div>
    );
}
