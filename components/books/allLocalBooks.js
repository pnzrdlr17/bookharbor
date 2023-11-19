import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
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
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ImageIcon from '@mui/icons-material/Image';
import PersonIcon from '@mui/icons-material/Person';
import TitleIcon from '@mui/icons-material/Title';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import DescriptionIcon from '@mui/icons-material/Description';
import { getImageUrl } from '@/lib/utilFuncs';

async function createBook(
  title,
  author,
  coverUrl,
  isbn,
  description,
  city,
  owner
) {
  const response = await fetch('/api/books/add-book', {
    method: 'POST',
    body: JSON.stringify({
      title,
      author,
      coverUrl,
      isbn,
      description,
      city,
      owner,
    }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrongg');
  }

  return data;
}

function AllLocalBooks(props) {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const titleInputRef = useRef();
  const authorInputRef = useRef();
  const coverInputRef = useRef();
  const isbnInputRef = useRef();
  const descriptionInputRef = useRef();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitHandler = async () => {
    if (status === 'unauthenticated') {
      router.replace('/auth');
      return;
    }

    const enteredTitle = titleInputRef.current.value;
    const enteredAuthor = authorInputRef.current.value;
    const enteredCover = coverInputRef.current.value;
    const enteredIsbn = isbnInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;

    const coverUrl = await getImageUrl(enteredCover);

    console.log(coverUrl);

    try {
      const result = await createBook(
        enteredTitle,
        enteredAuthor,
        coverUrl,
        enteredIsbn,
        enteredDescription,
        props.city,
        session.user.email
      );

      console.log(result);
      //   router.replace('/');
    } catch (error) {
      console.log(error);
    }

    setOpen(false);
  };

  const modal = (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>List a Book</DialogTitle>
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
              accept: 'image/png, image/jpeg, image/jpg',
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
    </Dialog>
  );

  return (
    <Box paddingLeft={4} paddingBottom={4} paddingRight={4}>
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
            // onChange={(event) => {
            //   setSearchTerm(event.target.value);
            // }}
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
      </Box>
      <ImageList cols={4} gap={8} sx={{ pl: 3, pr: 3 }}>
        {itemData.map((item) => (
          <ImageListItem key={item.img} sx={{ pt: 1, pl: 1, pr: 1, pb: 1 }}>
            <img
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=248&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar
              title={item.title}
              subtitle={<span>by: {item.author}</span>}
              position="below"
              actionIcon={
                <IconButton size="medium">
                  <FavoriteIcon fontSize="large" />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
      {modal}
    </Box>
  );
}

export default AllLocalBooks;

const itemData = [
  {
    img: 'https://cdn.chec.io/merchants/28663/assets/HqU0EVvijKqWdorm|1.jpg',
    title: 'The Art of War',
    author: 'Sun Tzu',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    author: '@rollelflex_graphy726',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    author: '@helloimnik',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    author: '@nolanissac',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    author: '@hjrc33',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
    author: '@tjdragotta',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
    author: '@katie_wasserman',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    author: '@silverdalex',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
    author: '@shelleypauls',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
    author: '@peterlaster',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    author: '@southside_customs',
  },
];
