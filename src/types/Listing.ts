export interface Listing {
    id: number;
    title: string;
    subcatname: string;
    catname: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;
    phone: string;
    weburl: string;
}

export interface PaginatedListingResult {
    success: boolean;
    metadata: {
        total: number;
        totalPages: number;
        currentPage: number;
        perPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
    links: {
        self: string;
        first: string;
        last: string;
        next: string | null;
        prev: string | null;
    };
    data: Listing[];
}
