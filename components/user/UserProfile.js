import ProfileForm from './ProfileForm';
import classes from './UserProfile.module.css';
// import { useEffect } from 'react';
// import { useSession, getSession } from 'next-auth/react';
import { useLoading } from '@/store/loading-context';
import { useSnackbar } from 'notistack';

function UserProfile(props) {
  // // Redirect away if NOT auth
  // const { data: session, status } = useSession();

  // useEffect(() => {
  //   getSession().then((session) => {
  //     if (!session) {
  //       window.location.href = '/';//avoid using it, hard-refreshes, state is lost ; instead useRouter,
  //     } else {
  //     }
  //   });
  // }, []);
  const { loading, setLoading } = useLoading();
  const { enqueueSnackbar } = useSnackbar();

  async function changePasswordHandler(passwordData) {
    try {
      setLoading(true);
      const response = await fetch('/api/user/change-password', {
        method: 'PATCH',
        body: JSON.stringify({ ...passwordData, session: props.session }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      console.log(data);
      enqueueSnackbar('Password changed successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Failed to change password, try again later', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler} />
    </section>
  );
}

export default UserProfile;
