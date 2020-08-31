import React from 'react';
// import { deepMap } from 'react-children-utilities';

import Example from '../components/Example';
import DesignTools from '../components/DesignTools';

import { FiberNode } from '../types';

import styles from '../styles/HomePage.module.css';

export default function HomePage() {
  const [targetData, setTargetData] = React.useState({});
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const [prevElement, setPrevElement] = React.useState<HTMLElement>();

  return (
    <div
      className={styles.container}
      id="__codesign"
      onClick={(
        event: React.MouseEvent<HTMLDivElement, MouseEvent> & {
          target: HTMLElement;
          _targetInst: FiberNode;
        }
      ) => {
        // Stop <a> links from navigating away
        event.preventDefault();

        const targetInst = event._targetInst;

        // Skip part of DesignTools
        if (targetInst.stateNode.dataset.id === 'design-tools') {
          return true;
        }

        if (prevElement) {
          prevElement.style.outline = null;
        }

        (event.target as HTMLElement).style.outline = '1px solid cyan';
        setPrevElement(event.target);

        // console.log('onClick');
        // console.log(event._dispatchInstances);
        // console.log(event._dispatchListeners);
        // console.log(event._targetInst);

        setTargetData({
          type: targetInst.type,
          className: targetInst.stateNode.className,
          lineNumber: targetInst._debugSource.lineNumber,
          columnNumber: targetInst._debugSource.columnNumber,
          pathname: targetInst._debugSource.fileName,
          node: targetInst.stateNode,
          _debugID: targetInst._debugID,
        });

        setSelectedNodes([targetInst]);
      }}
    >
      <Example />

      <main className="">
        <h1 className="uppercase text-xl">
          Welcome to <a href="https://nextjs.org">Next.js</a>
        </h1>

        <p className="">
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className="">
          <a href="https://nextjs.org/docs" className="">
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className="">
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className=""
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className=""
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>
      <DesignTools targetData={targetData} selectedNodes={selectedNodes} />
    </div>
  );
}
