import React from 'react';
import ReactDOM from 'react-dom';
import { Utils, traverse } from 'react-fiber-traverse';
import axios from 'axios';

import DesignToolsApp from './DesignToolsApp';

import { FiberNode } from '../types';

type Props = {
  selectedNodes?: FiberNode[];
};

const DesignToolsAppPortal = ({ selectedNodes = [] }: Props) => {
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

      const result = await axios.post('/api/component', {
        lineNumber: node._debugSource.lineNumber,
        columnNumber: node._debugSource.columnNumber,
        className: node.stateNode.className,
        fileName: node._debugSource.fileName,
      });

      console.log(result.data);
    }
  };

  if (canUseDOM()) {
    return ReactDOM.createPortal(
      <DesignToolsApp
        selectedNodes={selectedNodes}
        nodes={nodes}
        onSubmit={handleSubmit}
      />,
      document.body
    );
  }

  return null;
};

function canUseDOM() {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
}

export default DesignToolsAppPortal;
