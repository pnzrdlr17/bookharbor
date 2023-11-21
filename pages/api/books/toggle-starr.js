import { connectToDatabase } from '../../../lib/db';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { session, bookId } = req.body;
  if (!session) {
    console.log('Unauthenticated Request!');
    return;
  }
  const client = await connectToDatabase();
  const usersCollection = client.db().collection('users');

  const user = await usersCollection.findOne({ email: session.user.email });

  if (user.starr.includes(bookId)) {
    //unstarr
    await usersCollection.updateOne(
      { email: user.email },
      { $pull: { starr: bookId } }
    );

    const updatedUser = await usersCollection.findOne({ email: user.email });

    res
      .status(200)
      .json({ message: 'Removed starr', starr: updatedUser.starr });
  } else {
    //starr
    await usersCollection.updateOne(
      { email: user.email },
      { $push: { starr: bookId } }
    );

    const updatedUser = await usersCollection.findOne({ email: user.email });

    res.status(200).json({ message: 'Added starr', starr: updatedUser.starr });
  }

  client.close();
}
export default handler;
