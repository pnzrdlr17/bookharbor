import Head from 'next/head';
import Layout from '../components/layout/layout';
import { SessionProvider } from 'next-auth/react';
import { LoadingProvider } from '@/store/loading-context';
import SnackbarProviderWrapper from '@/components/snackbar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <SnackbarProviderWrapper>
        <LoadingProvider>
          <Layout>
            <Head>
              <title>BookHarbor</title>
              <link rel="shortcut icon" href="/images/favicon.ico" />
            </Head>
            <Component {...pageProps} />
          </Layout>
        </LoadingProvider>
      </SnackbarProviderWrapper>
    </SessionProvider>
  );
}

export default MyApp;
