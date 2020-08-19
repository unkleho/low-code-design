import '../styles/globals.css';

const Wrapper = ({ children }) => {
  // console.log(children);

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
