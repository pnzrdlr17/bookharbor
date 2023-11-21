import { getSession } from 'next-auth/react';
import AuthForm from '../components/auth/auth-form';
import Loading from '@/components/loading';
import { useLoading } from '@/store/loading-context';

function AuthPage() {
  const { loading, setLoading } = useLoading();

  if (loading) {
    return <Loading />;
  }
  return <AuthForm />;
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default AuthPage;
