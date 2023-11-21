import { CircularProgress, Box } from '@mui/material';

const Loading = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="92vh"
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
