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

type Props = {
  targetData?: {
    lineNumber: number;
    columnNumber: number;
    pathname: string;
    className: string;
  };
  // Should be added to all elements as a crude way to prevent selection by overall onClick handler
  dataId?: string;
};

const DesignTools = ({ targetData, dataId = 'design-tools' }: Props) => {
  const [nodes, setNodes] = React.useState<FiberNode[]>([]);
  const [inputValue, setInputValue] = React.useState('');

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
      <aside className="fixed top-0 w-64 bg-gray-100 border-r text-sm text-gray-800">
        <form onSubmit={handleSubmit} data-id={dataId}>
          <div className="border-b" data-id={dataId}>
            <div className="px-3 py-2 bg-gray-200 border-b">
              <h2 className="font-bold">Element</h2>
            </div>
            <div className="p-3">
              <div className="flex items-baseline mb-2">
                <p className="w-12 mr-2" data-id={dataId}>
                  Type{' '}
                </p>
                <span
                  className="px-2 py-1 font-bold bg-gray-200"
                  title={`Line ${targetData.lineNumber}, column ${targetData.columnNumber}, ${targetData.pathname}`}
                  data-id={dataId}
                >
                  {targetData.type && `${targetData.type}`}
                </span>
              </div>
              <div className="flex items-baseline">
                <p className="w-12 mb-2 mr-2">Class</p>
                <input
                  type="text"
                  value={inputValue || ''}
                  className="flex-1 p-1 border border-blue"
                  data-id={dataId}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="border-b">
            <div className="px-3 py-2 bg-gray-200 border-b">
              <h2 className="font-bold">Layers</h2>
            </div>
            <div className="p-3">
              <NodeTree
                parentID={rootNode?.return._debugID}
                nodes={nodes}
                selectedIDs={targetData._debugID ? [targetData._debugID] : []}
                dataId={dataId}
              />
            </div>
          </div>
        </form>
      </aside>,
      document.body
    );
  }

  return null;
};

type NodeTreeProps = {
  parentID: number;
  nodes: FiberNode[];
  selectedIDs: number[];
  dataId?: string;
};

const NodeTree = ({
  parentID,
  nodes = [],
  selectedIDs = [],
  dataId = 'design-tools',
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
        if (!node.elementType) {
          return null;
        }

        return (
          <li key={node._debugID} className="pl-4" data-id={dataId}>
            <button
              className={[
                selectedIDs.includes(node._debugID)
                  ? 'font-bold'
                  : 'font-normal',
              ].join(' ')}
              data-id={dataId}
              onClick={() => {
                if (node.stateNode) {
                  node.stateNode.click();
                }
              }}
            >
              {typeof node.type === 'function' ? node.type.name : node.type}
            </button>
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
