import { hashPassword, verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';
import { getServerSession } from 'next-auth';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getServerSession(req, res);
  
  if (!session) {
    res.status(401).json({ message: 'Unauthenticated Request!' });
    return;
  }

  const { oldPassword, newPassword } = req.body;

  const userEmail = session.user.email;

  const client = await connectToDatabase();
  const usersCollection = client.db().collection('users');

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    client.close();
    res.status(404).json({ message: 'User not found!' });
    return;
  }

  const isValid = await verifyPassword(oldPassword, user.password);

  if (!isValid) {
    client.close();
    res.status(403).json({ message: 'Old Passowrd INVALID!' });
    return;
  }

  const newHashedPassword = await hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: newHashedPassword } }
  );

  client.close();

  res.status(200).json({ message: 'Password updated successfully' });
}

export default handler;
