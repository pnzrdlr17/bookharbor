import { connectToDatabase } from '../../../lib/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  //error handling implement
  const data = req.body;
  const { title, author, coverUrl, isbn, description, city, owner } = data;

  //check data...

  const client = await connectToDatabase();
  const booksCollection = client.db().collection('books');

  const result = await booksCollection.insertOne({
    title: title,
    author: author,
    coverUrl: coverUrl,
    isbn: isbn,
    description: description,
    city: city,
    owner: owner,
  });

  console.log(result);

  res.status(201).json({ message: 'Book added successfully!' });
  client.close();
}

export default handler;
