export interface ProjectDeadline {
    _id: string;
    title: string;
    description: string;
    client: {
        _id: string;
        name: string;
        email: string;
        company?: string;
    };
    serviceType: string;
    status: 'requested' | 'quoted' | 'approved' | 'in-progress' | 'review' | 'completed' | 'cancelled';
    budget: number;
    deadline: string;
    daysUntilDeadline?: number;
    isOverdue?: boolean;
    isUrgent?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface DeadlineStats {
    upcoming: number;
    urgent: number;
    completed: number;
    overdue: number;
    total: number;
}