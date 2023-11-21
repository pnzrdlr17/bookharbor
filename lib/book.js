import { connectToDatabase } from './db';

export async function getAllBooksFromDB() {
  const client = await connectToDatabase();
  const booksCollection = client.db().collection('books');

  const booksList = await booksCollection.find().toArray();

  client.close();

  booksList.sort((a, b) =>
    a.title > b.title ? 1 : b.title > a.title ? -1 : 0
  );
  // booksList.sort(() => Math.random() - 0.5);

  return booksList;
}
