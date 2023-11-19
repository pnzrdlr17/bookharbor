import { MongoClient } from 'mongodb';

export async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(
      'mongodb+srv://newUser77:d1QDhiqZWy3OYd95@cluster0.uhitmnp.mongodb.net/bookHarbor?retryWrites=true&w=majority'
    );
    return client;
  } catch (error) {
    console.log(error);
  }
}
