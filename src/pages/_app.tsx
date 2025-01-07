import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/ThemeProvider';
import Layout from '@/components/Layout/Layout';
import { CssBaseline } from '@mui/material';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
} 