'use client';

import { useState } from 'react';
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
                setSuccess(`✅ ${result.message || `Se generaron ${result.createdItemsCount} items`}`);
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
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Generar Contenido Semanal</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="topics" className="block text-sm font-medium text-gray-700 mb-2">
                        Temas (uno por línea)
                    </label>
                    <textarea
                        id="topics"
                        value={topics}
                        onChange={(e) => setTopics(e.target.value)}
                        placeholder="Impacto de la IA en trabajos junior&#10;Habilidades blandas para el primer empleo&#10;Errores comunes al buscar práctica profesional"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
                        Contexto
                    </label>
                    <input
                        id="context"
                        type="text"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {loading ? '⏳ Generando contenido...' : '🚀 Generar Contenido'}
                </button>
            </form>
        </div>
    );
}
