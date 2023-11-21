import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../lib/db';

function isHexString(str) {
  return /^[0-9a-fA-F]{24}$/.test(str);
}

async function handler(req, res) {
  const { bookId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const client = await connectToDatabase();
    const booksCollection = client.db().collection('books');

    if (!isHexString(bookId)) {
      client.close();
      return res.status(404).json({ message: 'Not found!' });
    }

    const book = await booksCollection.findOne({ _id: new ObjectId(bookId) });

    if (!book) {
      client.close();
      return res.status(404).json({ message: 'Not found!' });
    }

    res.status(201).json({ message: 'Book found!', book });
    client.close();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default handler;
