import { connectToDatabase } from '../../../lib/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { session } = req.body;
  if (!session) {
    console.log('Unauthenticated Request!');
    return;
  }
  const client = await connectToDatabase();
  const usersCollection = client.db().collection('users');

  const user = await usersCollection.findOne({ email: session.user.email });

  if (!user) {
    client.close();
    res.status(404).json({ message: 'User not found!' });
    return;
  }

  res.status(200).json({ message: 'Added starr', starr: user.starr });

  client.close();
}
export default handler;
