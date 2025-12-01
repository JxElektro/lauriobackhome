'use client';

import { useEffect, useState } from 'react';
import { getBacklogItems } from '@/lib/api';
import { BacklogItem } from '@laurio/shared';
import Link from 'next/link';

export default function BacklogPage() {
    const [items, setItems] = useState<BacklogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Content Backlog</h1>
                    <Link
                        href="/generate"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Generate New Content
                    </Link>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No items yet. Generate some content to get started!
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-lg shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-semibold">{item.topic}</h3>
                                    <span className={`px-3 py-1 rounded text-sm ${item.status === 'ready_for_review' ? 'bg-yellow-100 text-yellow-800' :
                                            item.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">{item.mainMessage}</p>
                                <div className="flex gap-4 text-sm text-gray-500">
                                    <span>Type: {item.postType}</span>
                                    <span>Audience: {item.targetAudience}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
