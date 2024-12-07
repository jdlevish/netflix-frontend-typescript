import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { PaginatedListingResult, Listing } from "src/types/Listing";

const API_URL = "http://localhost:3000";

// Create a custom base query with retries
const baseQueryWithRetry = retry(
    fetchBaseQuery({
        baseUrl: API_URL,
        mode: 'cors',
        credentials: 'omit',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        timeout: 10000,
        prepareHeaders: (headers) => {
            console.log('Request Headers:', Object.fromEntries(headers.entries()));
            return headers;
        },
    }),
    { maxRetries: 2 }
);

export const listingsApi = createApi({
    reducerPath: "listingsApi",
    baseQuery: baseQueryWithRetry,
    endpoints: (builder) => ({
        getListings: builder.query<PaginatedListingResult, {
            page?: number;
            limit?: number;
            title?: string;
            subcatname?: string;
            catname?: string;
            city?: string;
            state?: string;
            id?: number;
        }>({
            query: (params = {}) => {
                const queryParams = {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    ...params
                };

                const queryString = new URLSearchParams(queryParams as any).toString();
                console.log('Listings Query URL:', `/api/listings?${queryString}`);
                console.log('Listings Query Params:', queryParams);
                
                return {
                    url: "/api/listings",
                    method: 'GET',
                    params: queryParams,
                };
            },
            transformErrorResponse: (response: any) => {
                console.error('Listings API Error:', response);
                return response;
            },
            transformResponse: (response: PaginatedListingResult) => {
                console.log('Listings API Response:', response);
                return response;
            },
            keepUnusedDataFor: 30,
        }),
        getListingById: builder.query<Listing, number>({
            query: (id) => {
                console.log('Fetching listing by ID:', id);
                // Use the same endpoint with id parameter
                return {
                    url: "/api/listings",
                    method: 'GET',
                    params: {
                        id: id
                    }
                };
            },
            transformResponse: (response: PaginatedListingResult) => {
                console.log('Single Listing Response:', response);
                if (!response.data?.length) {
                    throw new Error('Listing not found');
                }
                return response.data[0];
            },
            transformErrorResponse: (response: any) => {
                console.error('Single Listing Error:', response);
                return response;
            }
        }),
    }),
});

export const {
    useGetListingsQuery,
    useLazyGetListingsQuery,
    useGetListingByIdQuery,
} = listingsApi;
