'use client';

import { BacklogItem } from '@laurio/shared';

interface BacklogTableProps {
    items: BacklogItem[];
    onItemClick: (id: string) => void;
}

const statusColors: Record<string, string> = {
    idea: 'bg-gray-100 text-gray-800',
    drafting: 'bg-blue-100 text-blue-800',
    ready_for_review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    posted: 'bg-purple-100 text-purple-800',
};

const postTypeLabels: Record<string, string> = {
    ig_carousel: '📸 Carrusel',
    ig_post: '🖼️ Post',
    story_snippet: '📱 Story',
};

export default function BacklogTable({ items, onItemClick }: BacklogTableProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">No hay items en el backlog</p>
                <p className="text-gray-400 text-sm mt-2">Genera contenido usando el botón de arriba</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tema
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mensaje Principal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => onItemClick(item.id)}
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.topic}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                    {postTypeLabels[item.postType] || item.postType}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[item.status] || 'bg-gray-100 text-gray-800'}`}>
                                    {item.status.replace(/_/g, ' ')}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 max-w-md truncate">
                                    {item.mainMessage || '-'}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(item.createdAt).toLocaleDateString('es-ES')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
