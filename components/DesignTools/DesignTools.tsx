import React from 'react';
import ReactDOM from 'react-dom';
import { Utils, traverse } from 'react-fiber-traverse';
import axios from 'axios';

import Icon from '../Icon';
import NodeTree from '../NodeTree';

import { FiberNode } from '../../types';

type Props = {
  selectedNodes?: FiberNode[];
  // Should be added to all elements as a crude way to prevent selection by overall onClick handler
  dataId?: string;
  onSubmit?: Function;
};

const DesignTools = ({
  selectedNodes = [],
  dataId = 'design-tools',
}: Props) => {
  const [nodes, setNodes] = React.useState<FiberNode[]>([]);

  React.useEffect(() => {
    const rootFiberNode = Utils.getRootFiberNodeFromDOM(
      document.getElementById('__next')
    );

    // Doesn't work for some reason
    // const mainFiberNode = findNodeByComponentRef(rootFiberNode, ref.current);

    let isDesignTools = false;
    let nodes = [];

    // Traverse fiber node tree, adding each one to nodes.
    // TODO: Only add nodes within Wrapper
    traverse(rootFiberNode, (node) => {
      if (node.stateNode?.id === '__codesign' || isDesignTools) {
        isDesignTools = true;

        if (node.stateNode?.id !== '__codesign') {
          nodes.push(node);
        }
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

  // console.log(className.split(' '));

  function getClassNameValue(className = '', prefix) {
    return className
      .split(' ')
      .filter((c) => {
        return c.includes(prefix);
      })[0]
      ?.replace(prefix, '');
  }

  const paddingValue = getClassNameValue(className, 'p-');

  console.log(paddingValue);

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
          <PanelRow label="Type">
            {type && (
              <span
                className="px-2 py-1 font-bold bg-gray-200"
                title={`Line ${lineNumber}, column ${columnNumber}, ${fileName}`}
                data-id={dataId}
              >
                {type}
              </span>
            )}
          </PanelRow>

          <PanelRow label="Class">
            <form className="flex-1" onSubmit={handleSubmit} data-id={dataId}>
              <input
                type="text"
                value={classInputValue || ''}
                className="p-1 border border-blue"
                data-id={dataId}
                onChange={handleClassInputChange}
              />
            </form>
          </PanelRow>
        </div>
      </Panel>

      <Panel title="Layout">
        <div className="p-3">
          <PanelRow label="Position">
            <select className="p-1 border">
              <option label=" "></option>
              <option>Relative</option>
              <option>Absolute</option>
            </select>
          </PanelRow>

          <PanelRow label="Display">
            <select className="p-1 border">
              <option label=" "></option>
              <option>Block</option>
              <option>Flex</option>
            </select>
          </PanelRow>
        </div>
      </Panel>

      <Panel title="Spacing">
        <div className="p-3">
          <PanelRow label="Margin">
            <input
              type="text"
              placeholder="t"
              // value={marginValue || ''}
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
          </PanelRow>
          <PanelRow label="Padding">
            <input
              type="text"
              placeholder="t"
              // value={marginValue || ''}
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
          </PanelRow>
        </div>
      </Panel>

      <Panel title="Sizing">
        <div className="p-3">
          <PanelRow label="Width">
            <input type="text" className="p-1 border" />
          </PanelRow>
          <PanelRow label="Height">
            <input type="text" className="p-1 border" />
          </PanelRow>
        </div>
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

type PanelRowProps = {
  label: string;
  children: React.ReactNode;
};

const PanelRow = ({ label, children }: PanelRowProps) => {
  return (
    <div className="flex items-baseline mb-2 last:mb-0">
      <p className="w-12 mr-2 text-xs">{label}</p>
      <div className="flex flex-1">{children}</div>
    </div>
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
