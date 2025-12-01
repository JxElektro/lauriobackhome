'use client';

import { useState } from 'react';
import { triggerFlow } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GeneratePage() {
    const [topics, setTopics] = useState('');
    const [context, setContext] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const topicList = topics.split('\n').filter(t => t.trim());

        try {
            await triggerFlow(topicList, context || undefined);
            router.push('/backlog');
        } catch (err) {
            setError('Failed to generate content. Make sure both services are running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Link href="/backlog" className="text-blue-600 hover:underline">
                        ← Back to Backlog
                    </Link>
                </div>

                <h1 className="text-3xl font-bold mb-8">Generate New Content</h1>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Topics (one per line)
                        </label>
                        <textarea
                            value={topics}
                            onChange={(e) => setTopics(e.target.value)}
                            className="w-full border rounded p-3 h-32"
                            placeholder="AI in education&#10;Future of work&#10;Soft skills"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Context (optional)
                        </label>
                        <input
                            type="text"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            className="w-full border rounded p-3"
                            placeholder="Target audience: youth, tone: friendly"
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Generating...' : 'Generate Content'}
                    </button>
                </form>
            </div>
        </div>
    );
}
