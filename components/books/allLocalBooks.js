import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ImageIcon from '@mui/icons-material/Image';
import PersonIcon from '@mui/icons-material/Person';
import TitleIcon from '@mui/icons-material/Title';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuItem from '@mui/material/MenuItem';
import { cities } from '../../lib/citiesList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Link from 'next/link';
import { Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLoading } from '@/store/loading-context';
import { useSnackbar } from 'notistack';

async function createBook(
  title,
  author,
  cover,
  isbn,
  description,
  city
) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('author', author);
  formData.append('cover', cover);
  formData.append('isbn', isbn);
  formData.append('description', description);
  formData.append('city', city);

  const response = await fetch('/api/books/add-book', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrongg');
  }

  return data;
}

function AllLocalBooks(props) {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [filteredBookList, setFilteredBookList] = useState(props.booksList);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();
  const titleInputRef = useRef();
  const authorInputRef = useRef();
  const coverInputRef = useRef();
  const isbnInputRef = useRef();
  const descriptionInputRef = useRef();
  const { loading, setLoading } = useLoading();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const srch = searchTerm.trim();

    const newList = props.booksList.filter((book) => {
      if (book.city === props.city) {
        if (srch === '') {
          return book;
        } else if (
          book.title.toLowerCase().includes(srch.toLocaleLowerCase()) ||
          book.author.toLowerCase().includes(srch.toLocaleLowerCase()) ||
          book.isbn.toLowerCase().includes(srch.toLocaleLowerCase())
        ) {
          return book;
        }
      }
    });
    setFilteredBookList(newList);
  }, [props.city, searchTerm]);

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitHandler = async () => {
    try {
      setLoading(true);
      if (status === 'unauthenticated') {
        await router.replace('/auth');
        return;
      }

      const enteredTitle = titleInputRef.current.value;
      const enteredAuthor = authorInputRef.current.value;
      const enteredCover = coverInputRef.current.files[0];
      const enteredIsbn = isbnInputRef.current.value;
      const enteredDescription = descriptionInputRef.current.value;

      try {
        const result = await createBook(
          enteredTitle,
          enteredAuthor,
          enteredCover,
          enteredIsbn,
          enteredDescription,
          session.user.city
        );

        console.log(result);
        enqueueSnackbar(`Book Listed Successfully`, { variant: 'success' });
      } catch (error) {
        console.log(error);
        enqueueSnackbar(`Failed to add the book`, { variant: 'error' });
      }
      setOpen(false);
      router.reload();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const favClickHandler = async (bookId) => {
    try {
      const response = await fetch('/api/books/toggle-starr', {
        method: 'PATCH',
        body: JSON.stringify({ bookId: bookId }),
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
      props.setStarrArr(data.starr);
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  };

  const modal = (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>LIST A BOOK</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Join us in building a community buy offering up your book to others in
          need.
        </DialogContentText>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <TitleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            required
            inputRef={titleInputRef}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <PersonIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            autoFocus
            margin="dense"
            id="author"
            label="Author"
            type="text"
            fullWidth
            variant="standard"
            required
            inputRef={authorInputRef}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <ImageIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            autoFocus
            margin="dense"
            id="cover"
            label="Cover"
            type="file"
            inputProps={{
              accept: 'image/*',
            }}
            fullWidth
            variant="standard"
            inputRef={coverInputRef}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <QrCode2Icon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            autoFocus
            margin="dense"
            id="isbn"
            label="ISBN (13 digits)"
            type="number"
            fullWidth
            variant="standard"
            inputRef={isbnInputRef}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <DescriptionIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            multiline
            inputRef={descriptionInputRef}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>CANCEL</Button>
        <Button onClick={submitHandler}>ADD</Button>
      </DialogActions>
      <Typography variant="body3" style={{ padding: '10px' }}>
        <i>
          *You can list a book only in your locality. <br /> – To add a book in
          a different locality, edit your locality{' '}
          <Link href="/profile" variant="text" style={{ color: 'blue' }}>
            <u>here</u>
          </Link>
        </i>
      </Typography>
    </Dialog>
  );

  const modalCity = (
    <Dialog open={open2} onClose={handleClose2}>
      <DialogTitle>Select your Locality (City)</DialogTitle>
      <DialogContent style={{ paddingTop: '20px' }}>
        <TextField
          id="city"
          select
          label="Locality"
          name="city"
          fullWidth
          defaultValue={props.city}
          helperText="Please select your city"
        >
          {cities.map((city) => (
            <MenuItem
              key={city}
              value={city}
              disableRipple
              onClick={() => {
                props.setCity(city);
                handleClose2();
              }}
            >
              {city}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
    </Dialog>
  );

  return (
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
        <Fab sx={{ flexGrow: 1, borderRadius: '6px' }} variant="extended">
          <Input
            sx={{ flexGrow: 1 }}
            type="text"
            placeholder="Looking for something specific...?"
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </Fab>
        <Fab
          sx={{ borderRadius: '6px' }}
          variant="extended"
          color="primary"
          aria-label="list-a-book"
          onClick={handleClickOpen}
        >
          <AddIcon />
          &nbsp; List a Book
        </Fab>
        <Fab
          sx={{ borderRadius: '6px' }}
          variant="extended"
          color="primary"
          aria-label="city"
          onClick={handleClickOpen2}
        >
          {props.city} &nbsp; <KeyboardArrowDownIcon />
        </Fab>
      </Box>
      <Grid container spacing={2}>
        {filteredBookList.map((book, index) => (
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
                  {/* Left column */}
                  <Grid item xs={10} md={10}>
                    {/* First row in the left column */}
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

                    {/* Second row in the left column */}
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
                    {session && session.user.email === book.owner && (
                      <IconButton
                        align="right"
                        size="medium"
                        // onClick={() => toggleWishlist(index)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )}
                    {session && session.user.email !== book.owner && (
                      <IconButton
                        align="right"
                        size="medium"
                        onClick={() => {
                          favClickHandler(book.id);
                        }}
                      >
                        {!props.starrArr.includes(book.id) && (
                          <FavoriteIcon fontSize="medium" />
                        )}
                        {props.starrArr.includes(book.id) && (
                          <FavoriteIcon
                            sx={{ color: 'darkgoldenrod' }}
                            fontSize="medium"
                          />
                        )}
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {filteredBookList.length === 0 && (
        <Box flexGrow={1} display="table">
          <Typography
            variant="h2"
            align="center"
            display="table-cell"
            style={{ verticalAlign: 'middle' }}
            component="h1"
          >
            No books found...
          </Typography>
        </Box>
      )}
      {modal}
      {modalCity}
    </Box>
  );
}

export default AllLocalBooks;
