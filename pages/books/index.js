import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { cities } from '../../lib/citiesList';
import {
  Dialog,
  DialogActions,
  MenuItem,
  Box,
  TextField,
  Button,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import AllLocalBooks from '../../components/books/allLocalBooks';
import { getAllBooksFromDB } from '@/lib/book';
import Loading from '@/components/loading';
import { useLoading } from '@/store/loading-context';
import { useSnackbar } from 'notistack';

function AllBooksPage(props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [starrArr, setStarrArr] = useState([]);
  const [currentCity, setCurrentCity] = useState();
  const [open, setOpen] = useState(!currentCity);
  const { loading, setLoading } = useLoading();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (session && !currentCity) {
      setCurrentCity(session.user.city);
      setOpen(false);
    }
  }, [session]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/books/get-book-details', { method: 'GET' });
        const data = await response.json();
        setStarrArr(data.starr);
      } catch (error) {
        console.log('Error fetching book details', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDetails();
    }
  }, [status]);

  const cancelHandler = async () => {
    try {
      setLoading(true);
      setOpen(false);
      await router.replace('/');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setCurrentCity(data.get('city'));
    setOpen(false);
    enqueueSnackbar(`Locality set to ${data.get('city')}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Fragment>
      {status === 'unauthenticated' && (
        <Dialog
          open={open}
          onClose={cancelHandler}
          component="form"
          onSubmit={submitHandler}
        >
          <DialogTitle>Please select your Locality (City)</DialogTitle>
          <DialogContent>
            <TextField
              id="city"
              select
              label="Locality"
              name="city"
              required
              fullWidth
              defaultValue=""
              autoFocus
              helperText="Please select your city"
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelHandler}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </Dialog>
      )}
      <Box
        paddingLeft={4}
        paddingBottom={4}
        paddingRight={4}
        minHeight="92vh"
        display="flex"
        flexDirection="column"
      >
        <Box>
          {currentCity && (
            <AllLocalBooks
              city={currentCity}
              setCity={setCurrentCity}
              booksList={props.booksList}
              starrArr={starrArr}
              setStarrArr={setStarrArr}
            />
          )}
        </Box>
        <Box flexGrow={1}></Box>
      </Box>
    </Fragment>
  );
}

export async function getStaticProps() {
  const booksList = await getAllBooksFromDB();
  return {
    props: {
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
    revalidate: 2,
  };
}

export default AllBooksPage;
