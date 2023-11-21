import { MongoClient } from 'mongodb';

export async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.uhitmnp.mongodb.net/bookHarbor?retryWrites=true&w=majority`
    );
    return client;
  } catch (error) {
    console.log(error);
  }
}
