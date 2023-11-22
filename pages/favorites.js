import { getSession, useSession, getServerSession } from 'next-auth/react';
import { getAllBooksFromDB } from '@/lib/book';
import Loading from '@/components/loading';
import { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { useLoading } from '@/store/loading-context';
import { useSnackbar } from 'notistack';

function FavoritesPage(props) {
  const { loading, setLoading } = useLoading();
  const [starrArr, setStarrArr] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/books/get-book-details', {
          method: 'POST',
          body: JSON.stringify({ session: props.session }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setStarrArr(data.starr);
      } catch (error) {
        console.log('Error fetching book details', error);
      } finally {
        setLoading(false);
      }
    };

    if (props.session) {
      fetchDetails();
    }
  }, [props.session]);

  const favClickHandler = async (bookId) => {
    try {
      const response = await fetch('/api/books/toggle-starr', {
        method: 'PATCH',
        body: JSON.stringify({ bookId: bookId, session: props.session }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.starr.includes(bookId)) {
        enqueueSnackbar(`Added to Favorites`, { variant: 'info' });
      } else {
        enqueueSnackbar(`Removed from Favorites`, { variant: 'info' });
      }
      setStarrArr(data.starr);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box
      paddingLeft={4}
      paddingBottom={4}
      paddingRight={4}
      paddingTop={4}
      minHeight="92vh"
      display="flex"
      flexDirection="column"
    >
      <Box
        paddingLeft={4}
        paddingBottom={4}
        paddingRight={4}
        minHeight="50vh"
        display="flex"
        flexDirection="column"
      >
        <Box
          alignItems="stretch"
          display="flex"
          padding={2}
          sx={{
            '& > :not(style)': { m: 1 },
            flexDirection: { md: 'row', xs: 'column' },
          }}
        >
          <Typography variant="h3">Your Favorites</Typography>
        </Box>
        <hr />
        <Grid container spacing={2} paddingTop={2}>
          {props.booksList
            .filter((book) => {
              if (starrArr.includes(book.id)) {
                return book;
              }
            })
            .map((book) => (
              <Grid key={book.id} item xs={12} sm={6} md={4} lg={3}>
                <Card>
                  <Link href={`/books/${book.id}`}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={book.coverUrl}
                      alt={book.title}
                      sx={{ padding: '1em 1em 0 1em', objectFit: 'contain' }}
                    />
                  </Link>
                  <CardContent sx={{ objectFit: 'contain' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={10} md={10}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography
                              variant="h6"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              overflow="hidden"
                              noWrap
                            >
                              {book.title}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography
                              variant="subtitle2"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              overflow="hidden"
                              noWrap
                              color="textSecondary"
                            >
                              {book.author}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={2} md={2}>
                        <IconButton
                          align="right"
                          size="medium"
                          onClick={() => {
                            favClickHandler(book.id);
                          }}
                        >
                          {!starrArr.includes(book.id) && (
                            <FavoriteIcon fontSize="medium" />
                          )}
                          {starrArr.includes(book.id) && (
                            <FavoriteIcon
                              sx={{ color: 'darkgoldenrod' }}
                              fontSize="medium"
                            />
                          )}
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  const booksList = await getAllBooksFromDB();

  return {
    props: {
      session,
      booksList: booksList.map((book) => ({
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        isbn: book.isbn,
        description: book.description,
        owner: book.owner,
        city: book.city,
        id: book._id.toString(),
      })),
    },
  };
}

export default FavoritesPage;
