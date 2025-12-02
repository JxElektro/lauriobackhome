import { BacklogItem } from '@laurio/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getBacklogItems(filters?: { status?: string; postType?: string }): Promise<BacklogItem[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.postType) params.append('postType', filters.postType);

    const url = `${API_BASE_URL}/backlog${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch backlog items');
    }
    return response.json();
}

export async function getBacklogItem(id: string): Promise<BacklogItem> {
    const response = await fetch(`${API_BASE_URL}/backlog/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch backlog item');
    }
    return response.json();
}

export async function updateBacklogItem(id: string, data: Partial<BacklogItem>): Promise<BacklogItem> {
    const response = await fetch(`${API_BASE_URL}/backlog/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update backlog item');
    }
    return response.json();
}

export async function triggerFlow(
    topics: string[], 
    context?: string, 
    schedule?: { startAt?: string; intervalMinutes?: number }
): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/orchestrations/weekly-content`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topics, context, schedule }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        return { status: 'error', message: errorData.message || 'Failed to trigger flow' };
    }
    return response.json();
}

export async function triggerDailyMix(): Promise<any> {
    // We call BFF which then calls ADK
    const response = await fetch(`${API_BASE_URL}/orchestrations/daily-mix`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        return { status: 'error', message: errorData.message || 'Failed to trigger daily mix' };
    }
    return response.json();
}
