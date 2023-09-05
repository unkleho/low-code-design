import '../styles/globals.css';

const Wrapper = ({ children }) => {
  return children;
};

function MyApp({ Component, pageProps }) {
  return (
    <Wrapper>
      <Component {...pageProps} />
    </Wrapper>
  );
}

export default MyApp;
