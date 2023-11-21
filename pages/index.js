import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { getRandomQuote, getBookOfTheDay } from '../lib/utilFuncs';
import HeroSection from '../components/layout/HeroSection';
import { Fragment } from 'react';
import Loading from '@/components/loading';
import { useLoading } from '@/store/loading-context';

function HomePage(props) {
  const { loading, setLoading } = useLoading();
  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <HeroSection bookToday={props.bookToday} quote={props.quote} />
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          mb: 0,
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="md">
          <Typography variant="subtitle1">{props.quote}</Typography>
        </Container>
      </Box>
    </Fragment>
  );
}

export async function getStaticProps() {
  return {
    props: {
      quote: (await getRandomQuote()) || '',
      bookToday: (await getBookOfTheDay()) || {},
    },
    revalidate: 3600,
  };
}

export default HomePage;
