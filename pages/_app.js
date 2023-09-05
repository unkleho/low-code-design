import '../styles/globals.css';

const CodesignLiveAppWrapper = ({ children }) => {
  return children;
};

function MyApp({ Component, pageProps }) {
  return (
    <CodesignLiveAppWrapper>
      <Component {...pageProps} />
    </CodesignLiveAppWrapper>
  );
}

export default MyApp;
