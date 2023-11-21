import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { cities } from '@/lib/citiesList';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useLoading } from '@/store/loading-context';
import { useSnackbar } from 'notistack';

async function createUser(firstName, lastName, city, email, password) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, city, email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrongg');
  }

  return data;
}

export default function SignInSide() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const { loading, setLoading } = useLoading();
  const { enqueueSnackbar } = useSnackbar();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const handleSubmit = async (event) => {
    try {
      setLoading(true);
      event.preventDefault();

      const data = new FormData(event.currentTarget);

      const enteredFirstName = data.get('firstName');
      const enteredLastName = data.get('lastName');
      const enteredCity = data.get('city');
      const enteredEmail = data.get('email');
      const enteredPassword = data.get('password');

      //add data validation..

      if (!isLogin) {
        //creating user if its a signup
        try {
          const result = await createUser(
            enteredFirstName,
            enteredLastName,
            enteredCity,
            enteredEmail,
            enteredPassword
          );
          enqueueSnackbar('User Registered Successfully', {
            variant: 'success',
          });
          console.log(result);
        } catch (error) {
          console.log(error);
        }
      }

      //signing in
      const result = await signIn('credentials', {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });
      enqueueSnackbar(`You are Logged In`, { variant: 'success' });
      if (!result.error) {
        await router.replace('/');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{ height: '90vh', alignItems: 'center', justifyContent: 'center' }}
    >
      <CssBaseline />

      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        component={Paper}
        elevation={6}
        square
        sx={{ borderRadius: 4 }}
      >
        <Box
          sx={{
            my: 5,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {!isLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoComplete="given-name"
                name="firstName"
              />
            )}

            {!isLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            )}

            {!isLogin && (
              <TextField
                id="city"
                select
                label="Locality"
                name="city"
                required
                fullWidth
                defaultValue="New Delhi"
                helperText="Please select your city"
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            <Button
              fullWidth
              onClick={switchAuthModeHandler}
              size="small"
              variant="text"
              sx={{ mt: 2, mb: 1 }}
              disableRipple
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign in'}
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
