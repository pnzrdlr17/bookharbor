import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).end(); // Method Not Allowed
  }

  const session = await getServerSession(req, res);

  if (!session) {
    res.status(401).json({ message: 'Unauthenticated Request!' });
    return;
  }

  const { bookId, newStatus } = req.body;

  const client = await connectToDatabase();
  const usersCollection = client.db().collection('users');
  const booksCollection = client.db().collection('books');

  const user = await usersCollection.findOne({ email: session.user.email });
  const book = await booksCollection.findOne({ _id: new ObjectId(bookId) });

  if (newStatus === 'pending') {
    //only requester

    if (user.email === book.owner) {
      client.close();

      return res.status(406).json({
        message: 'Invalid Request!',
        bookRequests: user.bookRequests,
      });
    }

    //should not be in array

    if (user.bookRequests) {
      const found = user.bookRequests.find((item) => item.bookId === bookId);
      if (found) {
        res.status(200).json({
          message: 'Book Already Requested!',
          bookRequests: user.bookRequests,
        });
        client.close();
        return;
      }
    }

    //and then add to the array
    await usersCollection.updateOne(
      { email: user.email },
      {
        $push: {
          bookRequests: { bookId: bookId, time: new Date(), status: newStatus },
        },
      }
    );

    //add to the books collection too..
    if (book.userRequests) {
      const found2 = book.userRequests.find(
        (item) => item.userEmail === user.email
      );
      if (found2) {
        res.status(200).json({
          message: 'Book Already Requested!',
          bookRequests: user.bookRequests,
        });
        client.close();
        return;
      }
    }

    //and then add to the array
    await booksCollection.updateOne(
      { _id: new ObjectId(bookId) },
      {
        $push: {
          userRequests: {
            userEmail: user.email,
            name: `${user.firstName} ${user.lastName}`,
            time: new Date(),
            status: newStatus,
          },
        },
      }
    );

    const updatedUser = await usersCollection.findOne({ email: user.email });
    res.status(200).json({
      message: 'Book Requested Successfully!',
      bookRequests: updatedUser.bookRequests,
    });
  } else if (newStatus === 'unrequested') {
    //only requester
    if (user.email === book.owner) {
      client.close();

      return res.status(406).json({
        message: 'Invalid Request!',
        bookRequests: user.bookRequests,
      });
    }
    //find and delete from the array
    await usersCollection.updateOne(
      { email: user.email },
      { $pull: { bookRequests: { bookId: bookId } } }
    );

    await booksCollection.updateOne(
      { _id: new ObjectId(bookId) },
      { $pull: { userRequests: { userEmail: user.email } } }
    );

    const updatedUser = await usersCollection.findOne({ email: user.email });

    res.status(200).json({
      message: 'Request Cancelled Successfully!',
      bookRequests: updatedUser.bookRequests,
    });
  } else if (newStatus === 'accepted' || newStatus === 'denied') {
    const { requestedUserEmail } = req.body;
    //only owner should do this

    if (user.email !== book.owner) {
      client.close();
      res.status(401).json({
        message: 'Unauthenticated Request!',
        userRequests: book.userRequests,
      });
      return;
    }

    if (book.userRequests) {
      const found = book.userRequests.find(
        (item) => item.userEmail === requestedUserEmail
      );

      //currstatus should be pending
      if (found.status !== 'pending') {
        client.close();
        res.status(200).json({
          message: `Request Already Disposed as: ${found.status}`,
          userRequests: book.userRequests,
        });
        return;
      }
    } else {
      client.close();
      res.status(200).json({
        message: `No such request found!`,
        userRequests: book.userRequests,
      });
      return;
    }

    //update the status in the arrays
    await booksCollection.updateOne(
      { _id: book._id, 'userRequests.userEmail': requestedUserEmail },
      { $set: { 'userRequests.$.status': newStatus } }
    );

    await usersCollection.updateOne(
      { email: requestedUserEmail, 'bookRequests.bookId': bookId },
      { $set: { 'bookRequests.$.status': newStatus } }
    );

    const updatedBook = await booksCollection.findOne({ _id: book._id });

    res.status(200).json({
      message: `Request ${newStatus}  Successfully!`,
      userRequests: updatedBook.userRequests,
    });
  }
  client.close();
  res.status(406).end();
}
export default handler;
