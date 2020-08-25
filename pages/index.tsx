// import RenderHook from 'react-render-hook';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Utils,
  // findNodeByComponentRef,
  // findNodeByComponentName,
  traverse,
} from 'react-fiber-traverse';
import axios from 'axios';
// import { deepMap } from 'react-children-utilities';

import styles from '../styles/HomePage.module.css';
import Example from '../components/Example';
import { FiberNode } from 'react-fiber-traverse/dist/mocked-types';

export default function HomePage() {
  const [targetData, setTargetData] = React.useState({});
  const [prevElement, setPrevElement] = React.useState();
  const [counter, setCounter] = React.useState(0);

  return (
    // <Wrapper>
    <>
      <div
        className={styles.container}
        id="__codesign"
        onClick={(
          event: React.MouseEvent<HTMLDivElement, MouseEvent> & {
            _targetInst: FiberNode & {
              _debugSource: {
                lineNumber: number;
                columnNumber: number;
                fileName: string;
              };
              _debugID: number;
            };
          }
        ) => {
          setCounter(counter + 1);

          if (prevElement) {
            prevElement.style.outline = null;
          }
          (event.target as HTMLDivElement).style.outline = '1px solid cyan';
          setPrevElement(event.target);

          const targetInst = event._targetInst;

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
        }}
      >
        <Example />

        {counter}

        <main className={styles.main}>
          <h1 className="lowercase">
            Welcome to <a href="https://nextjs.org">Next.js</a>
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

      <DesignPanels targetData={targetData} />
    </>
    // </Wrapper>
  );
}

function canUseDOM() {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
}

const DesignPanels = ({ targetData }) => {
  const [nodes, setNodes] = React.useState([]);
  const [inputValue, setInputValue] = React.useState();

  console.log(targetData);

  const targetLineNumber = targetData?.lineNumber;
  const targetColumnNumber = targetData?.columnNumber;
  const targetPathname = targetData?.pathname;
  const targetClassName = targetData?.className;

  React.useEffect(() => {
    const rootFiberNode = Utils.getRootFiberNodeFromDOM(
      document.getElementById('__next')
    );

    // Doesn't work for some reason
    // const mainFiberNode = findNodeByComponentRef(rootFiberNode, ref.current);

    let isDesignPanels = false;
    let nodes = [];
    traverse(rootFiberNode, (node) => {
      if (node.stateNode?.id === '__codesign' || isDesignPanels) {
        isDesignPanels = true;
        nodes.push(node);
      }
    });
    // Filter out DesignPanels, otherwise we are inspecting the UI that is inspecting the UI
    // TODO: Just removing the top DesignPanels for now, but should remove child nodes too for performance
    setNodes(nodes.filter((node) => node.type?.name !== 'DesignPanels'));

    // console.log(rootFiberNode);
    // console.log(mainFiberNode);
  }, []);

  React.useEffect(() => {
    setInputValue(targetClassName);
  }, [targetClassName]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // targetData.publicInstance.className = inputValue;
    targetData.node.className = inputValue;

    const result = await axios.get('/api/component', {
      params: {
        lineNumber: targetLineNumber,
        columnNumber: targetColumnNumber,
        className: inputValue,
        pathname: targetPathname,
      },
    });

    console.log(result.data);
  };

  const rootNode = nodes[0];

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  if (canUseDOM()) {
    return ReactDOM.createPortal(
      <div
        style={{
          position: 'fixed',
          top: 0,
          // backgroundColor: 'white',
        }}
      >
        <NodeTree
          parentID={rootNode?.return._debugID}
          nodes={nodes}
          selectedIDs={targetData._debugID ? [targetData._debugID] : []}
        />

        {targetData && (
          <div
            style={{
              padding: '1rem',
            }}
          >
            <p>{targetData.type}</p>
            <p>
              {targetData.lineNumber} {targetData.pathname}
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue || ''}
                onChange={handleInputChange}
              />
            </form>
          </div>
        )}
      </div>,
      document.body
    );
  }

  return null;
};

const NodeTree = ({ parentID, nodes = [], selectedIDs = [] }) => {
  const childNodes = nodes.filter((node) => {
    return node.return._debugID === parentID;
  });

  if (childNodes.length === 0) {
    return null;
  }

  return (
    <ul>
      {childNodes.map((node) => {
        // console.log(node);
        return (
          <li
            key={node._debugID}
            className={[
              'pl-4',
              selectedIDs.includes(node._debugID) ? 'font-bold' : 'font-normal',
            ].join(' ')}
          >
            {typeof node.type === 'function' ? node.type.name : node.type}{' '}
            {node.memoizedProps.className}
            <NodeTree
              parentID={node._debugID}
              nodes={nodes}
              selectedIDs={selectedIDs}
            />
          </li>
        );
      })}
    </ul>
  );
};
