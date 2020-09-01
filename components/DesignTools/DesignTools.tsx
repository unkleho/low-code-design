import React from 'react';
import ReactDOM from 'react-dom';
import { Utils, traverse } from 'react-fiber-traverse';
import axios from 'axios';

import Icon from '../Icon';
import NodeTree from '../NodeTree';
import {
  DesignToolsProvider,
  useDesignTools,
  types,
} from '../../lib/contexts/design-tools-context';

import { FiberNode } from '../../types';

type Props = {
  selectedNodes?: FiberNode[];
  // Should be added to all elements as a crude way to prevent selection by overall onClick handler
  dataId?: string;
  // onSubmit?: Function;
};

const DesignToolsApp = ({
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
    if (node) {
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
    }
  };

  if (canUseDOM()) {
    return ReactDOM.createPortal(
      <DesignToolsProvider>
        <DesignToolsDisplay
          selectedNodes={selectedNodes}
          nodes={nodes}
          dataId={dataId}
          onSubmit={handleSubmit}
        />
      </DesignToolsProvider>,
      document.body
    );
  }

  return null;
};

type DesignToolsDisplayProps = {
  selectedNodes: FiberNode[];
  nodes: FiberNode[];
  // dataId: string;
  onSubmit: Function;
};

const DesignToolsDisplay = ({
  selectedNodes = [],
  nodes = [],
  // dataId,
  onSubmit,
}: DesignToolsDisplayProps) => {
  const [classInputValue, setClassInputValue] = React.useState('');
  const rootNode = nodes[0];
  const selectedNode = selectedNodes[0]; // Allow multi-select in the future

  // TODO: Consider moving this into context
  const type = selectedNode?.type;
  const lineNumber = selectedNode?._debugSource.lineNumber;
  const columnNumber = selectedNode?._debugSource.columnNumber;
  const fileName = selectedNode?._debugSource.fileName;
  const className = selectedNode?.stateNode.className || '';
  const selectedIDs = selectedNode?._debugID ? [selectedNode._debugID] : [];

  const { state, dispatch } = useDesignTools();

  // --------------------------------------------------------------------------
  // Effects
  // --------------------------------------------------------------------------

  // Set initial className when there is a new selectedNode
  React.useEffect(() => {
    setClassInputValue(className);

    dispatch({
      type: types.UPDATE_CLASS_NAME,
      className,
    });
  }, [className]);

  // Update className text field and send callback
  React.useEffect(() => {
    setClassInputValue(state.className);
  }, [state.className]);

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------

  const handleFormSubmit = (event) => {
    event.preventDefault();

    dispatch({
      type: types.UPDATE_CLASS_NAME,
      className: classInputValue,
    });

    handleSubmit({
      node: selectedNode,
      newClassName: classInputValue,
    });
  };

  const handleClassInputChange = (event) => {
    setClassInputValue(event.target.value);
  };

  const handleSubmit = ({ node, newClassName }) => {
    if (typeof onSubmit === 'function') {
      onSubmit([
        {
          node,
          update: {
            className: newClassName,
          },
        },
      ]);
    }
  };
  // console.log(state.position);

  return (
    <aside className="fixed top-0 w-64 max-h-full bg-gray-100 border-r text-sm text-gray-800">
      <Panel title="Element">
        <div className="p-3">
          <PanelRow label="Type">
            {type && (
              <span
                className="px-2 py-1 font-bold bg-gray-200"
                title={`Line ${lineNumber}, column ${columnNumber}, ${fileName}`}
              >
                {type}
              </span>
            )}
          </PanelRow>

          <PanelRow label="Class">
            <form className="flex-1" onSubmit={handleFormSubmit}>
              <input
                type="text"
                value={classInputValue || ''}
                className="p-1 border border-blue"
                onChange={handleClassInputChange}
              />
            </form>
          </PanelRow>
        </div>
      </Panel>

      <Panel title="Layout">
        <div className="p-3">
          <PanelRow label="Position">
            <select
              className="p-1 border"
              value={state.position || ''}
              onChange={(event) => {
                const { value } = event.target;

                const newClassName = state.position
                  ? // Replace with new value
                    state.className.replace(state.position, value)
                  : // Otherwise append to className
                    `${state.className} ${value}`;

                dispatch({
                  type: types.UPDATE_CLASS_NAME,
                  className: newClassName,
                });

                handleSubmit({
                  node: selectedNode,
                  newClassName,
                });
              }}
            >
              <option label=" "></option>
              {['relative', 'absolute', 'sticky'].map((option) => {
                return (
                  <option value={option} key={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </PanelRow>

          <PanelRow label="Display">
            <select
              className="p-1 border"
              value={state.display || ''}
              onChange={(event) => {
                const { value } = event.target;

                const newClassName = state.display
                  ? // Replace with new value
                    state.className.replace(state.display, value)
                  : // Otherwise append to className
                    `${state.className} ${value}`;

                dispatch({
                  type: types.UPDATE_CLASS_NAME,
                  className: newClassName,
                });

                handleSubmit({
                  node: selectedNode,
                  newClassName,
                });
              }}
            >
              <option label=" "></option>
              {['block', 'flex', 'grid'].map((option) => {
                return (
                  <option value={option} key={option}>
                    {option}
                  </option>
                );
              })}
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
              value={state.marginTop || ''}
              className="flex-1 w-full p-1 mr-1 border border-t-2"
            />
            <input
              type="text"
              placeholder="r"
              value={state.marginRight || ''}
              className="flex-1 w-full p-1 mr-1 border border-r-2"
            />
            <input
              type="text"
              placeholder="b"
              value={state.marginBottom || ''}
              className="flex-1 w-full p-1 mr-1 border border-b-2"
            />
            <input
              type="text"
              placeholder="l"
              value={state.marginLeft || ''}
              className="flex-1 w-full p-1 border border-l-2"
            />
          </PanelRow>

          <PanelRow label="Padding">
            <input
              type="text"
              placeholder="t"
              value={state.paddingTop || ''}
              className="flex-1 w-full p-1 mr-1 border border-t-2"
            />
            <input
              type="text"
              placeholder="r"
              value={state.paddingRight || ''}
              className="flex-1 w-full p-1 mr-1 border border-r-2"
            />
            <input
              type="text"
              placeholder="b"
              value={state.paddingBottom || ''}
              className="flex-1 w-full p-1 mr-1 border border-b-2"
            />
            <input
              type="text"
              placeholder="l"
              value={state.paddingLeft || ''}
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
            // dataId={dataId}
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

export default DesignToolsApp;
