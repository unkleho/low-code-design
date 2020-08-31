import React from 'react';
import ReactDOM from 'react-dom';
import { Utils, traverse } from 'react-fiber-traverse';
import axios from 'axios';

import { FiberNode } from '../../types';

type Props = {
  targetData?: {
    lineNumber: number;
    columnNumber: number;
    pathname: string;
    className: string;
  };
  selectedNodes?: FiberNode[];
  // Should be added to all elements as a crude way to prevent selection by overall onClick handler
  dataId?: string;
  onSubmit?: Function;
};

const DesignTools = ({
  targetData,
  selectedNodes = [],
  dataId = 'design-tools',
}: // onSubmit,
Props) => {
  const [nodes, setNodes] = React.useState<FiberNode[]>([]);

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

  // Make updates to DOM and send API request
  const handleSubmit = async (
    events: [
      {
        node: FiberNode;
        update: {
          className: string;
        };
      }
    ]
  ) => {
    const event = events[0]; // Allow multiple node changes in future
    const { node } = event;

    // Change DOM element className
    node.stateNode.className = event.update.className;

    const result = await axios.get('/api/component', {
      params: {
        lineNumber: node._debugSource.lineNumber,
        columnNumber: node._debugSource.columnNumber,
        className: node.stateNode.className,
        fileName: node._debugSource.fileName,
      },
    });

    console.log(result.data);
  };

  if (canUseDOM()) {
    return ReactDOM.createPortal(
      <DesignToolsDisplay
        selectedNodes={selectedNodes}
        nodes={nodes}
        dataId={dataId}
        onSubmit={handleSubmit}
      />,
      document.body
    );
  }

  return null;
};

type DesignToolsDisplayProps = {
  selectedNodes: FiberNode[];
  nodes: FiberNode[];
  dataId: string;
  onSubmit: Function;
};

const DesignToolsDisplay = ({
  selectedNodes = [],
  nodes = [],
  dataId,
  onSubmit,
}: DesignToolsDisplayProps) => {
  const [classInputValue, setClassInputValue] = React.useState('');
  const rootNode = nodes[0];
  const selectedNode = selectedNodes[0]; // Allow multi-select in the future

  const type = selectedNode?.type;
  const lineNumber = selectedNode?._debugSource.lineNumber;
  const columnNumber = selectedNode?._debugSource.columnNumber;
  const fileName = selectedNode?._debugSource.fileName;
  const className = selectedNode?.stateNode.className;
  const selectedIDs = selectedNode?._debugID ? [selectedNode._debugID] : [];

  React.useEffect(() => {
    setClassInputValue(className);
  }, [className]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (typeof onSubmit === 'function') {
      onSubmit([
        {
          node: selectedNode,
          update: {
            className: classInputValue,
          },
        },
      ]);
    }
  };

  const handleClassInputChange = (event) => {
    setClassInputValue(event.target.value);
  };

  return (
    <aside className="fixed top-0 w-64 max-h-full bg-gray-100 border-r text-sm text-gray-800">
      <Panel title="Element">
        <div className="p-3">
          <div className="flex items-baseline mb-2">
            <p className="w-12 mr-2" data-id={dataId}>
              Type{' '}
            </p>
            {type && (
              <span
                className="px-2 py-1 font-bold bg-gray-200"
                title={`Line ${lineNumber}, column ${columnNumber}, ${fileName}`}
                data-id={dataId}
              >
                {type}
              </span>
            )}
          </div>
          <div className="flex items-baseline">
            <p className="w-12 mb-2 mr-2">Class</p>
            <form onSubmit={handleSubmit} data-id={dataId}>
              <input
                type="text"
                value={classInputValue || ''}
                className="flex-1 p-1 border border-blue"
                data-id={dataId}
                onChange={handleClassInputChange}
              />
            </form>
          </div>
        </div>
      </Panel>

      <Panel title="Layout">
        <div className="p-3">
          <div className="flex mb-2">
            <p className="w-12 mr-2">Position</p>
            <select className="px-1 border">
              <option label=" "></option>
              <option>Relative</option>
              <option>Absolute</option>
            </select>
          </div>
          <div className="flex">
            <p className="w-12 mr-2">Display</p>
            <select className="px-1 border">
              <option label=" "></option>
              <option>Block</option>
              <option>Flex</option>
            </select>
          </div>
        </div>
      </Panel>

      <Panel title="Spacing">
        <div className="p-3">
          <div className="flex items-baseline">
            <p className="w-12 mr-2">Margin</p>
            <div className="flex flex-1">
              <input
                type="text"
                placeholder="t"
                className="flex-1 w-full p-1 mr-1 border border-t-2"
              />
              <input
                type="text"
                placeholder="r"
                className="flex-1 w-full p-1 mr-1 border border-r-2"
              />
              <input
                type="text"
                placeholder="b"
                className="flex-1 w-full p-1 mr-1 border border-b-2"
              />
              <input
                type="text"
                placeholder="l"
                className="flex-1 w-full p-1 border border-l-2"
              />
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Sizing">
        <div className="p-3"></div>
      </Panel>

      <Panel title="Layers">
        <div className="py-1">
          <NodeTree
            parentID={rootNode?.return._debugID}
            nodes={nodes}
            selectedIDs={selectedIDs}
            dataId={dataId}
          />
        </div>
      </Panel>
    </aside>
  );
};

type PanelProps = {
  title: string;
  children: React.ReactNode;
};

const Panel = ({ title, children }: PanelProps) => {
  return (
    <div className="border-b">
      <div className="flex px-3 py-2 bg-gray-200 border-b">
        <h2 className="mr-auto font-bold">{title}</h2>
        <Icon name="chevron-down" />
      </div>
      <div>{children}</div>
    </div>
  );
};

type NodeTreeProps = {
  parentID: number;
  nodes: FiberNode[];
  selectedIDs: number[];
  level?: number;
  dataId?: string;
};

const getChildNodes = (nodes, parentID) => {
  return nodes.filter((node) => {
    return node.return._debugID === parentID;
  });
};

const NodeTree = ({
  parentID,
  nodes = [],
  selectedIDs = [],
  level = 0,
  dataId = 'design-tools',
}: NodeTreeProps) => {
  const childNodes = getChildNodes(nodes, parentID);

  if (childNodes.length === 0) {
    return null;
  }

  return (
    <ul className="pl-0">
      {childNodes.map((node) => {
        if (!node.elementType) {
          return null;
        }

        const isSelected = selectedIDs.includes(node._debugID);
        const grandChildNodes = getChildNodes(nodes, node._debugID);

        return (
          <li key={node._debugID} data-id={dataId}>
            <button
              className={[
                'flex w-full py-1',
                isSelected ? 'font-bold' : 'font-normal',
                isSelected ? 'bg-gray-200' : '',
              ].join(' ')}
              data-id={dataId}
              style={{
                paddingLeft: (level + 1) * 12,
              }}
              onClick={() => {
                if (node.stateNode) {
                  node.stateNode.click();
                }
              }}
            >
              {grandChildNodes.length > 0 ? (
                <span className="mr-1 text-gray-500 text-xs">&#9660;</span>
              ) : (
                // &#9654; Right Triangle
                // <Icon name="chevron-down" />
                <div className="pl-4" />
              )}
              {typeof node.type === 'function' ? node.type.name : node.type}
            </button>
            {/* {node.memoizedProps.className} */}
            <NodeTree
              parentID={node._debugID}
              nodes={nodes}
              selectedIDs={selectedIDs}
              level={level + 1}
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

const Icon = ({ name }) => {
  switch (name) {
    case 'chevron-down':
      return (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="chevron-down w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      );
    case 'chevron-up':
      return (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="chevron-up w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      );
    case 'chevron-right':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'code':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return null;
  }
};

export default DesignTools;
