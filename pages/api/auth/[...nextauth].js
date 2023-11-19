import { verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  session: {
    jwt: true,
  },

  callbacks: {
    session: async ({ session, token }) => {
      session.id = token.id;
      session.jwt = token.jwt;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.city = token.city;

      return Promise.resolve(session);
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.jwt = user.jwt;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.city = user.city;
      }
      return Promise.resolve(token);
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await connectToDatabase();

        const usersCollection = client.db().collection('users');

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error('No user found!');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error('Password incorrect!');
        }

        client.close();

        return {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          city: user.city,
        };
      },
    }),
  ],
});
