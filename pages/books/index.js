import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { cities } from '@/lib/citiesList';
import {
  Dialog,
  DialogActions,
  MenuItem,
  TextField,
  Button,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import AllLocalBooks from '@/components/books/allLocalBooks';

function AllBooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      setCurrentCity(session.user.city);
      setOpen(false);
    }
  }, [session]);

  const [currentCity, setCurrentCity] = useState();

  const [open, setOpen] = useState(!currentCity);

  const cancelHandler = () => {
    setOpen(false);
    router.replace('/');
  };

  const confirmHandler = () => {
    setOpen(false);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setCurrentCity(data.get('city'));
    setOpen(false);
  };

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
      {currentCity && <AllLocalBooks city={currentCity} />}
    </Fragment>
  );
}

export default AllBooksPage;
