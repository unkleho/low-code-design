// import RenderHook from 'react-render-hook';
import React from 'react';
import ReactDOM from 'react-dom';
// import Head from 'next/head';
import { deepMap } from 'react-children-utilities';

import styles from '../styles/Home.module.css';
import Example from '../components/Example';

const Wrapper = ({ children }) => {
  // console.log(children);

  // console.log(children.props.children[1]._source);

  return deepMap(children, (child) => {
    // console.log(child.type);
    if (child && child.type) {
      // console.log(child._source);
      return React.cloneElement(child, {
        ...child.props,
        'data-id': 'test',
      });
    }

    return child;
  });

  // return children;
};

export default function Home() {
  const ref = React.useRef();
  const [targetInst, setTargetInst] = React.useState();

  // React.useEffect(() => {
  //   console.log(RenderHook);
  //   // console.log(RenderHook.isAttached);
  //   const component = RenderHook.findComponent(ref.current);
  //   console.log(component.data.children[2].child._debugSource);
  //   // Use _reactInternalInstance._debugSource to get fileName
  // }, []);

  React.useEffect(() => {
    // Fake click the ref so it triggers onClick handler
    ref.current.click();
  }, [ref]);

  return (
    <Wrapper>
      <div
        ref={ref}
        className={styles.container}
        id="kaho"
        onClick={(event) => {
          // const component = RenderHook.findComponent(event.target);
          // console.log(component);

          // console.log(event);
          // console.log(event._dispatchInstances);
          // console.log(event._dispatchListeners);
          // console.log(event._targetInst);

          setTargetInst(event._targetInst);
        }}
        // onMouseOver={(event) => {
        //   console.log(event);
        // }}
      >
        {/* <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head> */}

        <Example />

        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <a href="https://nextjs.org">Next.js!</a>
          </h1>

          <p className={styles.description}>
            Get started by editing{' '}
            <code className={styles.code}>pages/index.js</code>
          </p>

          <div className={styles.grid}>
            <a href="https://nextjs.org/docs" className={styles.card}>
              <h3>Documentation &rarr;</h3>
              <p>Find in-depth information about Next.js features and API.</p>
            </a>

            <a href="https://nextjs.org/learn" className={styles.card}>
              <h3>Learn &rarr;</h3>
              <p>Learn about Next.js in an interactive course with quizzes!</p>
            </a>

            <a
              href="https://github.com/vercel/next.js/tree/master/examples"
              className={styles.card}
            >
              <h3>Examples &rarr;</h3>
              <p>Discover and deploy boilerplate example Next.js projects.</p>
            </a>

            <a
              href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              className={styles.card}
            >
              <h3>Deploy &rarr;</h3>
              <p>
                Instantly deploy your Next.js site to a public URL with Vercel.
              </p>
            </a>
          </div>
        </main>
      </div>

      <ComponentTree targetInst={targetInst} />
    </Wrapper>
  );
}

// const MyComponent = () => ReactDOM.createPortal(<FOO/>, 'dom-location')

function canUseDOM() {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
}

const ComponentTree = ({ targetInst }) => {
  if (canUseDOM()) {
    return ReactDOM.createPortal(
      <ul
        style={{
          position: 'fixed',
          top: 0,
          backgroundColor: 'white',
        }}
      >
        {targetInst?.memoizedProps.children.map((child, i) => {
          return <ComponentTreeChild component={child} key={i} />;
        })}
      </ul>,
      document.body
    );
  }

  return null;
};

const ComponentTreeChild = ({ component }) => {
  if (component.type) {
    console.log(component.type);
    console.log(component);
    return (
      <li>
        {component.type.name ? component.type.name : component.type}
        {component.props.className ? ` (${component.props.className})` : null}
        {Array.isArray(component.props.children) && (
          <ul>
            {component.props.children.map((child, i) => (
              <ComponentTreeChild component={child} key={i} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return null;
};
