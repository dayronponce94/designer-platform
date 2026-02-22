export interface Request {
    _id: string;
    title: string;
    description: string;
    client: {
        _id: string;
        name: string;
        email: string;
        company?: string;
        phone?: string;
    };
    serviceType: 'branding' | 'ux-ui' | 'graphic' | 'web' | 'motion' | 'illustration' | 'other';
    status: 'requested' | 'quoted' | 'cancelled';
    attachments: Array<{
        url: string;
        filename: string;
        filetype: string;
        size: number;
        uploadedAt: string;
    }>;
    budget?: number;
    deadline?: string;
    references?: string;
    createdAt: string;
    updatedAt: string;
}