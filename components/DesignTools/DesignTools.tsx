import React from 'react';
import ReactDOM from 'react-dom';
import {
  Utils,
  traverse,
  // findNodeByComponentRef,
  // findNodeByComponentName,
} from 'react-fiber-traverse';
import axios from 'axios';

import { FiberNode } from '../../types';

const DesignTools = ({ targetData }) => {
  const [nodes, setNodes] = React.useState<FiberNode[]>([]);
  const [inputValue, setInputValue] = React.useState();

  // console.log(targetData);

  const targetLineNumber = targetData?.lineNumber;
  const targetColumnNumber = targetData?.columnNumber;
  const targetPathname = targetData?.pathname;
  const targetClassName = targetData?.className;

  const rootNode = nodes[0];

  React.useEffect(() => {
    const rootFiberNode = Utils.getRootFiberNodeFromDOM(
      document.getElementById('__next')
    );

    // Doesn't work for some reason
    // const mainFiberNode = findNodeByComponentRef(rootFiberNode, ref.current);

    let isDesignTools = false;
    let nodes = [];
    traverse(rootFiberNode, (node) => {
      if (node.stateNode?.id === '__codesign' || isDesignTools) {
        isDesignTools = true;
        nodes.push(node);
      }
    });

    // Filter out DesignTools, otherwise we are inspecting the UI that is inspecting the UI
    // TODO: Just removing the top DesignTools for now, but should remove child nodes too for performance
    setNodes(nodes.filter((node) => node.type?.name !== 'DesignTools'));

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

        {targetData.type && (
          <div
            style={{
              padding: '1rem',
            }}
          >
            <p>{`<${targetData.type}>`}</p>
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

type NodeTreeProps = {
  parentID: number;
  nodes: FiberNode[];
  selectedIDs: number[];
};

const NodeTree = ({
  parentID,
  nodes = [],
  selectedIDs = [],
}: NodeTreeProps) => {
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
          <li
            key={node._debugID}
            className={[
              'pl-4',
              selectedIDs.includes(node._debugID) ? 'font-bold' : 'font-normal',
            ].join(' ')}
            onClick={() => {
              // TODO: Select corresponding element
              // console.log(node);
              // node.stateNode.click();
            }}
          >
            {typeof node.type === 'function' ? node.type.name : node.type}
            {/* {node.memoizedProps.className} */}
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

function canUseDOM() {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
}

export default DesignTools;
