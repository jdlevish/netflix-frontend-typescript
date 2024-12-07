import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Paper, Link, Button } from '@mui/material';
import { useGetListingByIdQuery } from 'src/store/slices/listingsApiSlice';
import MainLoadingScreen from 'src/components/MainLoadingScreen';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DetailPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#141414',
  color: 'white',
  marginTop: theme.spacing(4),
}));

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  console.log('ListingDetail: Fetching listing ID:', id);
  
  const { data: listing, isLoading, error } = useGetListingByIdQuery(Number(id), {
    // Log any errors
    onError: (error) => {
      console.error('Error fetching listing:', error);
    }
  });

  useEffect(() => {
    console.log('ListingDetail: Current listing data:', listing);
  }, [listing]);

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return <MainLoadingScreen />;
  }

  if (error || !listing) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mb: 2, color: 'white' }}
          >
            Back to Results
          </Button>
          <Typography variant="h5" color="error">
            {error ? 'Error loading listing details' : 'Listing not found'}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            {error ? 'Please try again later.' : 'The requested listing could not be found.'}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mb: 2, color: 'white' }}
        >
          Back to Results
        </Button>
        <DetailPaper elevation={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                {listing.title}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Location
              </Typography>
              <Typography>
                {listing.address1}<br />
                {listing.city}, {listing.state} {listing.zip}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Typography>
                {listing.phone && (
                  <Box>
                    Phone: <Link href={`tel:${listing.phone}`} color="inherit">{listing.phone}</Link>
                  </Box>
                )}
                {listing.weburl && (
                  <Box>
                    Website: <Link href={listing.weburl} target="_blank" rel="noopener noreferrer" color="inherit">
                      Visit Website
                    </Link>
                  </Box>
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Category
              </Typography>
              <Typography>
                {listing.catname} - {listing.subcatname}
              </Typography>
            </Grid>
          </Grid>
        </DetailPaper>
      </Box>
    </Container>
  );
};

export default ListingDetail;
