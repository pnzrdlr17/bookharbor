import { getSession } from 'next-auth/react';
import Loading from '@/components/loading';
import { useLoading } from '@/store/loading-context';
import { Box, Typography } from '@mui/material';

function NotificationsPage(props) {
  const { loading, setLoading } = useLoading();

  if (loading) {
    return <Loading />;
  }

  return (
    <Box textAlign="center">
      <Typography variant="h1">Notifications</Typography>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default NotificationsPage;


