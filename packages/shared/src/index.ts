export type PostType = "ig_carousel" | "ig_post" | "story_snippet";

export interface BacklogItem {
    id: string;
    createdAt: string;
    updatedAt: string;
    status: "idea" | "drafting" | "ready_for_review" | "approved" | "posted";
    topic: string;
    postType: PostType;
    targetAudience: "youth" | "teachers" | "school_leaders" | "other";
    mainMessage: string;
    objective: string;
    sourceInsights: {
        sourceUrl: string;
        sourceTitle: string;
        summary: string;
    }[];
    structure?: {
        slides?: {
            id: number;
            role: string;
            text: string;
        }[];
        caption?: string;
        storySnippets?: string[];
    };
    visualPrompts?: {
        forSlide?: number | null;
        description: string;
    }[];
    visualMock?: string;
    notes?: string;
    plannedDate?: string | null;
}
