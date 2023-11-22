import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import Link from 'next/link';
import { useLoading } from '@/store/loading-context';
import { useSnackbar } from 'notistack';

const RequestsList = (props) => {
  const { loading, setLoading } = useLoading();
  const { enqueueSnackbar } = useSnackbar();

  const acceptHandler = async (email) => {
    try {
      // setLoading(true);
      const response = await fetch('/api/books/change-bookRequests', {
        method: 'PATCH',
        body: JSON.stringify({
          bookId: props.bookId,
          session: props.session,
          requestedUserEmail: email,
          newStatus: 'accepted',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      enqueueSnackbar(`Request ACCEPTED`, { variant: 'success' });

      props.setUserRequestArr(data.userRequests);

      console.log(data.message);
    } catch (error) {
      enqueueSnackbar(`Request ACCEPT: Failed, try again!`, {
        variant: 'error',
      });
      console.error('Error fetching data:', error);
    } finally {
      // setLoading(false);
    }
  };

  const denyHandler = async (email) => {
    try {
      // setLoading(true);
      const response = await fetch('/api/books/change-bookRequests', {
        method: 'PATCH',
        body: JSON.stringify({
          bookId: props.bookId,
          session: props.session,
          requestedUserEmail: email,
          newStatus: 'denied',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      enqueueSnackbar(`Request DENIED`, { variant: 'warning' });
      props.setUserRequestArr(data.userRequests);
    } catch (error) {
      enqueueSnackbar(`Request DENY: Failed, try again!`, { variant: 'error' });
      console.error('Error fetching data:', error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" align="center">
          Requests
        </Typography>
        <hr />
      </Grid>
      {!props.userRequestArr ||
        (props.userRequestArr.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" color="textSecondary" align="center">
              No requests yet...!
            </Typography>
          </Grid>
        ))}
      {props.userRequestArr.map((request) => (
        <Grid
          container
          spacing={2}
          key={request.userEmail}
          margin="10px"
          alignItems="center"
        >
          <Grid item xs={2} sm={1}>
            <Avatar
              alt={request.name}
              src={`https://gravatar.com/avatar/${request.userEmail}?d=identicon`}
            />
          </Grid>

          <Grid item xs={10} sm={7}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  noWrap
                >
                  {request.name}
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
                  <Link href={`mailto:${request.userEmail}`}>
                    {request.userEmail}
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {request.status === 'pending' && (
            <Grid item xs={6} sm={2}>
              <Button
                variant="text"
                color="primary"
                fullWidth
                startIcon={<DoneIcon fontSize="inherit" />}
                onClick={() => {
                  acceptHandler(request.userEmail);
                }}
              >
                Accept
              </Button>
            </Grid>
          )}
          {request.status === 'pending' && (
            <Grid item xs={6} sm={2}>
              <Button
                variant="text"
                color="error"
                fullWidth
                startIcon={<ClearIcon fontSize="inherit" />}
                onClick={() => {
                  denyHandler(request.userEmail);
                }}
              >
                Deny
              </Button>
            </Grid>
          )}
          {request.status === 'accepted' && (
            <Grid item xs={12} sm={4}>
              <Grid container direction="row" alignItems="center">
                <Typography variant="subtitle1" color="success.main">
                  Request ACCEPTED &nbsp;
                </Typography>
                <CheckCircleOutlineIcon fontSize="small" color="success" />
              </Grid>
            </Grid>
          )}
          {request.status === 'denied' && (
            <Grid item xs={12} sm={4} sx={{ verticalAlign: 'center' }}>
              <Grid container direction="row" alignItems="center">
                <Typography variant="subtitle1" color="error">
                  Request DENIED &nbsp;
                </Typography>
                <CancelIcon fontSize="small" color="error" />
              </Grid>
            </Grid>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default RequestsList;
