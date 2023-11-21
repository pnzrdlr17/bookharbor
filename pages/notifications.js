import { getSession } from 'next-auth/react';
import UserProfile from '../components/user/UserProfile';
import Loading from '@/components/loading';
import { useLoading } from '@/store/loading-context';
import {
  Grid,
  Box,
  Button,
  TextField,
  CssBaseline,
  Typography,
  Paper,
} from '@mui/material';

function NotificationsPage(props) {
  const { loading, setLoading } = useLoading();

  if (loading) {
    return <Loading />;
  }

  //   margin: 3rem auto;
  //   text-align: center;
  //   font-size: 5rem;

  return (
    // <section className={classes.profile}>
    <section>
      <h1>Your User Profile</h1>
      <Grid
        container
        component="main"
        sx={{ height: '65vh', alignItems: 'center', justifyContent: 'center' }}
      >
        <CssBaseline />

        <Grid item xs={12} sm={6} md={4} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h5" variant="h5">
              CHANGE PASSWORD
            </Typography>
            <Box
              component="form"
              // onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                name="oldPassword"
                label="Old Password"
                type="password"
                id="oldPassword"
                autoComplete="current-password"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Change Password
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </section>
  );

  //   return <NotificationsPage session={props.session} />;
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default NotificationsPage;
