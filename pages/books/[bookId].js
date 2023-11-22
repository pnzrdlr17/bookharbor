import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Typography } from '@mui/material';
import BookDetail from '../../components/books/bookDetail';
import { useLoading } from '../../store/loading-context';
import Loading from '@/components/loading';
import { useSnackbar } from 'notistack';

const BookDetailPage = (prop) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { bookId } = router.query;
  const [noBook, setNoBook] = useState(false);
  const { loading, setLoading } = useLoading();
  const [book, setBook] = useState(null);
  const [starrArr, setStarrArr] = useState([]);
  const [bookRequestArr, setBookRequestArr] = useState([]);
  const [userRequestArr, setUserRequestArr] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/books/${bookId}`, { method: 'GET' });
        const data = await response.json();
        if (data.message === 'Not found!') {
          setBook(null);
          setNoBook(true);
        } else {
          setBook(data.book);
        }
      } catch (error) {
        console.log('Error fetching book details', error);
      } finally {
        setLoading(false);
      }
    };

    if (!document.hidden && bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/books/get-book-details', { method: 'GET' });
        const data = await response.json();
        setStarrArr(data.starr);
        setBookRequestArr(data.bookRequests);
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

  useEffect(() => {
    const fetchRequestDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/books/get-book-requests', {
          method: 'POST',
          body: JSON.stringify({ bookId: bookId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.requestArr) {
          setUserRequestArr(data.requestArr);
        }
      } catch (error) {
        console.log('Error fetching book request details', error);
      } finally {
        setLoading(false);
      }
    };

    if (session && book && session.user.email === book.owner) {
      fetchRequestDetails();
    }
  }, [status, book]);

  if (loading) {
    return <Loading />;
  }

  if (noBook) {
    enqueueSnackbar('No Book Found!', {
      variant: 'error',
      preventDuplicate: true,
    });
  }

  return (
    <Box
      paddingLeft={4}
      paddingBottom={4}
      paddingRight={4}
      minHeight="92vh"
      display="flex"
      flexDirection="column"
    >
      {book && (
        <BookDetail
          book={book}
          starrArr={starrArr}
          setStarrArr={setStarrArr}
          bookRequestArr={bookRequestArr}
          setBookRequestArr={setBookRequestArr}
          userRequestArr={userRequestArr}
          setUserRequestArr={setUserRequestArr}
        />
      )}
      {noBook && (
        <Box flexGrow={1}>
          <Typography
            variant="h2"
            align="center"
            display="table-cell"
            style={{ verticalAlign: 'middle' }}
            component="h1"
          >
            No book found...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BookDetailPage;
