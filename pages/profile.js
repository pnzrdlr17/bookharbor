import { getSession } from 'next-auth/react';
import UserProfile from '../components/user/UserProfile';
import Loading from '@/components/loading';
import { useLoading } from '@/store/loading-context';

function ProfilePage(props) {
  const { loading, setLoading } = useLoading();

  if (loading) {
    return <Loading />;
  }

  return <UserProfile session={props.session} />;
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: '/auth',
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: { session },
  };
}

export default ProfilePage;
