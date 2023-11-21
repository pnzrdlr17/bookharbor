import {
  Grid,
  Box,
  Button,
  TextField,
  CssBaseline,
  Typography,
  Paper,
} from '@mui/material';

function ProfileForm(props) {
  function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const oldPassword = data.get('oldPassword');
    const newPassword = data.get('newPassword');

    //sending request via parent component instead

    props.onChangePassword({
      oldPassword: oldPassword,
      newPassword: newPassword,
    });

    event.currentTarget.reset();
  }

  return (
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
            onSubmit={handleSubmit}
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
  );
}

export default ProfileForm;
