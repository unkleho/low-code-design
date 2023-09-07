import Head from 'next/head';
import '../styles/globals.css';

const CodesignLiveAppWrapper = ({ children }) => {
  return children;
};

function MyApp({ Component, pageProps }) {
  return (
    <CodesignLiveAppWrapper>
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <Component {...pageProps} />
    </CodesignLiveAppWrapper>
  );
}

export default MyApp;
