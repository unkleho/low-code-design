import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import DesignToolsApp from './DesignToolsApp';

import { FiberNode, NodeChangeEvent } from '../types';

type Props = {
  selectedNodes?: FiberNode[];
};

// type NodeChangeEvent = {
//   type: 'UPDATE_FILE_CLASS_NAME' | 'UPDATE_FILE_TEXT';
//   node: FiberNode;
//   className?: string;
//   text?: string;
// };

const DesignToolsAppPortal = ({ selectedNodes = [] }: Props) => {
  // Make updates to DOM and send API request
  const handleNodeChange = async (events: NodeChangeEvent[]) => {
    const event = events[0]; // Allow multiple node changes in future
    const { node } = event;

    // Change DOM element className
    if (node) {
      if (event.type === 'UPDATE_FILE_CLASS_NAME') {
        node.stateNode.className = event.className;

        const result = await axios.post('/api/component/class-name', {
          className: event.className,
          lineNumber: node._debugSource.lineNumber,
          columnNumber: node._debugSource.columnNumber,
          fileName: node._debugSource.fileName,
        });

        console.log(event.type, result.data);
      } else if (event.type === 'UPDATE_FILE_TEXT') {
        if (event.text) {
          node.stateNode.innerText = event.text;
        }
      }
    }
  };

  if (canUseDOM()) {
    return ReactDOM.createPortal(
      <DesignToolsApp
        selectedNodes={selectedNodes}
        onNodeChange={handleNodeChange}
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
