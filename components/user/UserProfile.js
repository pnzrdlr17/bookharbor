import ProfileForm from './ProfileForm';
import classes from './UserProfile.module.css';
import { useLoading } from '@/store/loading-context';
import { useSnackbar } from 'notistack';

function UserProfile(props) {
  const { loading, setLoading } = useLoading();
  const { enqueueSnackbar } = useSnackbar();

  async function changePasswordHandler(passwordData) {
    try {
      setLoading(true);
      const response = await fetch('/api/user/change-password', {
        method: 'PATCH',
        body: JSON.stringify({ ...passwordData }),
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
