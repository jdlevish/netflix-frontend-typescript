import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useGetListingsQuery } from "src/store/slices/listingsApiSlice";
import CircularProgress from "@mui/material/CircularProgress";

export default function ListingGrid() {
    const result = useGetListingsQuery({
        page: 1,
        limit: 10
    }, {
        // Add retry logic
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        refetchOnFocus: false,
    });

    const { data: listingsData, isLoading, error, isError } = result;

    useEffect(() => {
        if (isError) {
            console.error('Listings API Error:', error);
            console.error('Full query result:', result);
        }
        if (listingsData) {
            console.log('Listings Data:', listingsData);
        }
    }, [error, listingsData, isError, result]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography color="error">
                    Error loading listings. Please check the console for more details.
                    {error instanceof Error ? `: ${error.message}` : ''}
                </Typography>
            </Box>
        );
    }

    if (!listingsData?.data) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography>No listings found.</Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={2} padding={2}>
            {listingsData.data.map((listing) => (
                <Grid item xs={12} sm={6} md={4} key={listing.id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div" gutterBottom>
                                {listing.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {listing.address1}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {`${listing.city}, ${listing.state} ${listing.zip}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {listing.phone}
                            </Typography>
                            {listing.weburl && (
                                <Typography variant="body2">
                                    <a href={listing.weburl} target="_blank" rel="noopener noreferrer">
                                        Visit Website
                                    </a>
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
