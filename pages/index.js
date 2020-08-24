// import RenderHook from 'react-render-hook';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Utils,
  findNodeByComponentRef,
  findNodeByComponentName,
  traverse,
} from 'react-fiber-traverse';
import axios from 'axios';
// import { deepMap } from 'react-children-utilities';

import styles from '../styles/HomePage.module.css';
import Example from '../components/Example';

// const Wrapper = ({ children }) => {
// console.log(children);

// console.log(children.props.children[1]._source);

// return deepMap(children, (child) => {
//   // console.log(child.type);
//   if (child && child.type) {
//     // console.log(child._source);
//     return React.cloneElement(child, {
//       ...child.props,
//       'data-id': 'test',
//     });
//   }

//   return child;
// });

//   return children;
// };

export default function HomePage() {
  const ref = React.useRef();
  const [topLevelInst, setTopLevelInst] = React.useState();
  const [targetData, setTargetData] = React.useState();
  const [counter, setCounter] = React.useState(0);
  const [nodes, setNodes] = React.useState([]);

  React.useEffect(() => {
    // console.log(RenderHook);
    // console.log(RenderHook.isAttached);
    // const component = RenderHook.findComponent(ref.current);
    // console.log(component);
    // console.log(component.data.children[2].child._debugSource);
    // Use _reactInternalInstance._debugSource to get fileName
    // const root = Utils.getRootFiberNodeFromDOM(
    //   document.getElementById('__next')
    // );
    // console.log(root);
  }, []);

  React.useEffect(() => {
    // Fake click the ref so it triggers onClick handler
    if (!topLevelInst) {
      ref.current.click();
    }

    const rootFiberNode = Utils.getRootFiberNodeFromDOM(
      document.getElementById('__next')
    );

    // Doesn't work for some reason
    // const mainFiberNode = findNodeByComponentRef(rootFiberNode, ref.current);

    let isComponentTree = false;
    let nodes = [];
    traverse(rootFiberNode, (node) => {
      if (node.stateNode?.id === '__codesign' || isComponentTree) {
        isComponentTree = true;
        nodes.push(node);
        // console.log(node);
      }
    });
    // Filter out ComponentTree, otherwise we are inspecting the UI that is inspecting the UI
    // TODO: Just removing the top ComponentTree for now, but should remove child nodes too for performance
    setNodes(nodes.filter((node) => node.type?.name !== 'ComponentTree'));

    // console.log(rootFiberNode);
    // console.log(mainFiberNode);
  }, [ref]);

  return (
    // <Wrapper>
    <>
      <div
        ref={ref}
        className={styles.container}
        id="__codesign"
        onClick={(event) => {
          // const component = RenderHook.findComponent(event.target);
          // console.log(component);
          // console.log(component.data);
          // console.log(component.internalInstance._debugSource);
          // setTargetData(component.data);

          setCounter(counter + 1);

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
          });

          if (!topLevelInst) {
            // console.log(event._dispatchInstances);
            setTopLevelInst(event._targetInst);
          }
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

      <ComponentTree targetData={targetData} nodes={nodes} />
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

const ComponentTree = ({ targetData, nodes = [] }) => {
  const [inputValue, setInputValue] = React.useState();

  const targetLineNumber = targetData?.lineNumber;
  const targetColumnNumber = targetData?.columnNumber;
  const targetPathname = targetData?.pathname;
  const targetClassName = targetData?.className;

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
        <NodeTree parentID={rootNode?.return._debugID} nodes={nodes} />
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

const NodeTree = ({ parentID, nodes = [] }) => {
  const childNodes = nodes.filter((node) => {
    return node.return._debugID === parentID;
  });

  if (childNodes.length === 0) {
    return null;
  }

  return (
    <ul>
      {childNodes.map((node) => {
        console.log(node);
        return (
          <li key={node._debugID} className="pl-4">
            {typeof node.type === 'function' ? node.type.name : node.type}{' '}
            {node.memoizedProps.className}
            <NodeTree parentID={node._debugID} nodes={nodes} />
          </li>
        );
      })}
    </ul>
  );
};
