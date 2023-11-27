import { Container, Grid, Typography, Paper, Button, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import ClearIcon from '@mui/icons-material/Clear';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSession } from 'next-auth/react';
import RequestsList from './requestsList';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

const BookDetail = (props) => {
  const { data: session, status } = useSession();
  const book = props.book;
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const favClickHandler = async () => {
    try {
      const response = await fetch('/api/books/toggle-starr', {
        method: 'PATCH',
        body: JSON.stringify({ bookId: book._id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.starr.includes(book._id)) {
        enqueueSnackbar(`Added to Favorites`, { variant: 'info' });
      } else {
        enqueueSnackbar(`Removed from Favorites`, { variant: 'info' });
      }

      props.setStarrArr(data.starr);
      console.log(data.message);
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  };

  const requestClickHandler = async () => {
    if(!session){
      router.push('/auth');
      return;
    }
    try {
      const response = await fetch('/api/books/change-bookRequests', {
        method: 'PATCH',
        body: JSON.stringify({
          bookId: book._id,
          newStatus: 'pending',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      enqueueSnackbar(`Book Requested Successfully!`, {
        variant: 'success',
      });
      props.setBookRequestArr(data.bookRequests);
      console.log(data.message);
    } catch (error) {
      enqueueSnackbar(`Request send failed!`, { variant: 'error' });
      console.error('Error fetching data:', error);
    } 
  };

  const cancelClickHandler = async () => {
    try {
      const response = await fetch('/api/books/change-bookRequests', {
        method: 'PATCH',
        body: JSON.stringify({
          bookId: book._id,
          newStatus: 'unrequested',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      enqueueSnackbar(`Request Cancelled`, { variant: 'warning' });
      props.setBookRequestArr(data.bookRequests);
      console.log(data.message);
    } catch (error) {
      enqueueSnackbar(`Failed to Cancel Request`, { variant: 'error' });
      console.error('Error fetching data:', error);
    } 
  };

  const bookStatus = (bookId) => {
    if (props.bookRequestArr) {
      const found = props.bookRequestArr.find((item) => item.bookId === bookId);
      if (found) {
        return found.status;
      }
    }
    return 'unrequested';
  };

  return (
    <Container
      sx={{
        paddingTop: { xs: '0', sm: '20px' },
        paddingLeft: { xs: '0', sm: '50px' },
        paddingRight: { xs: '0', sm: '50px' },
      }}
    >
      <Paper elevation={16} sx={{ padding: '20px', marginBottom: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={9} md={4}>
            <img
              src={book.coverUrl}
              alt={book.title}
              style={{ width: '100%' }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  {book.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  {book.author}
                </Typography>
              </Box>
              {session && session.user.email !== book.owner && (
                <IconButton
                  sx={{
                    paddingLeft: '10px',
                    paddingRight: '20px',
                    paddingTop: 0,
                  }}
                  onClick={favClickHandler}
                >
                  {!props.starrArr.includes(book._id) && (
                    <FavoriteIcon fontSize="large" />
                  )}
                  {props.starrArr.includes(book._id) && (
                    <FavoriteIcon
                      sx={{ color: 'darkgoldenrod' }}
                      fontSize="large"
                    />
                  )}
                </IconButton>
              )}
            </Box>

            <Box style={{ marginTop: '20px', marginBottom: '20px' }}>
              {session &&
                session.user.email !== book.owner &&
                bookStatus(book._id) === 'pending' && (
                  <Grid container direction="row" alignItems="center">
                    <Typography variant="subtitle1" color="textSecondary">
                      Request Pending ...&nbsp;
                    </Typography>
                    <AccessTimeIcon fontSize="small" color="action" />
                  </Grid>
                )}

              {session &&
                session.user.email !== book.owner &&
                bookStatus(book._id) === 'accepted' && (
                  <Grid container direction="row" alignItems="center">
                    <Typography variant="subtitle1" color="success.main">
                      Request Accepted &nbsp;
                    </Typography>
                    <CheckCircleOutlineIcon fontSize="small" color="success" />
                  </Grid>
                )}

              {session &&
                session.user.email !== book.owner &&
                bookStatus(book._id) === 'denied' && (
                  <Grid container direction="row" alignItems="center">
                    <Typography variant="subtitle1" color="error">
                      Request Denied &nbsp;
                    </Typography>
                    <CancelIcon fontSize="small" color="error" />
                  </Grid>
                )}

              {(!session || session.user.email !== book.owner) &&
                bookStatus(book._id) === 'unrequested' && (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '10px', marginRight: '10px' }}
                    onClick={requestClickHandler}
                  >
                    REQUEST BOOK
                  </Button>
                )}
              {session &&
                session.user.email !== book.owner &&
                bookStatus(book._id) === 'pending' && (
                  <Button
                    variant="contained"
                    color="error"
                    style={{ marginTop: '10px', marginRight: '10px' }}
                    onClick={cancelClickHandler}
                  >
                    <ClearIcon /> &nbsp; CANCEL REQUEST
                  </Button>
                )}

              {session &&
                session.user.email !== book.owner &&
                bookStatus(book._id) === 'accepted' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    style={{ marginTop: '10px', marginRight: '10px' }}
                    href={`mailto:${book.owner}`}
                  >
                    <MailIcon />
                    &nbsp; Contact Owner
                  </Button>
                )}

              {session && session.user.email === book.owner && (
                <Button
                  variant="outlined"
                  color="secondary"
                  style={{ marginTop: '10px', marginRight: '10px' }}
                >
                  <EditIcon /> &nbsp; Edit
                </Button>
              )}
              {session && session.user.email === book.owner && (
                <Button
                  variant="outlined"
                  color="secondary"
                  style={{ marginTop: '10px', marginRight: '10px' }}
                >
                  <DeleteIcon /> &nbsp; Delete
                </Button>
              )}
            </Box>
            <Typography variant="body2" paragraph>
              {book.description}
            </Typography>
            <Typography variant="subtitle1">Locality: {book.city}</Typography>
            <Typography variant="subtitle2">ISBN: {book.isbn}</Typography>
          </Grid>
        </Grid>
      </Paper>
      {session && session.user.email === book.owner && (
        <Paper
          sx={{
            marginBottom: '20px',
            padding: { xs: '5px', sm: '20px' },
          }}
          elevation={9}
        >
          <RequestsList
            userRequestArr={props.userRequestArr}
            setUserRequestArr={props.setUserRequestArr}
            session={session}
            bookId={book._id}
          />
        </Paper>
      )}
      {session && (
        <Paper
          style={{
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          elevation={8}
        >
          <ChatIcon color="action" />
          <Typography variant="h6" color="text.secondary" align="center">
            &nbsp; Chat Coming Soon!
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default BookDetail;
