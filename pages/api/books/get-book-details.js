import { connectToDatabase } from '../../../lib/db';
import { getServerSession } from 'next-auth';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const session = await getServerSession(req, res);

  if (!session) {
    res.status(401).json({ message: 'Unauthenticated Request!' });
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

  res.status(200).json({
    message: 'User Book Detail fetched successfully!',
    starr: user.starr,
    bookRequests: user.bookRequests,
  });

  client.close();
}

export default handler;
