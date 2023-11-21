import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }
  let arr = [];
  const { session, bookId } = req.body;
  if (!session) {
    return res
      .status(401)
      .json({ message: 'Unauthenticated Request!', requestArr: arr });
  }
  const client = await connectToDatabase();
  const booksCollection = client.db().collection('books');

  const book = await booksCollection.findOne({ _id: new ObjectId(bookId) });

  if (!book) {
    client.close();
    return res
      .status(404)
      .json({ message: 'Book not found!', requestArr: arr });
  }

  if (book.owner !== session.user.email) {
    client.close();
    return res
      .status(401)
      .json({ message: 'Unauthenticated Request!', requestArr: arr });
  }
  client.close();

  if (book.userRequests) arr = book.userRequests;

  return res.status(200).json({
    message: 'Book Requests fetched successfully!',
    requestArr: arr,
  });
}

export default handler;
