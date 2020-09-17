import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import DesignToolsApp from './DesignToolsApp';

import { FiberNode } from '../types';

type Props = {
  selectedNodes?: FiberNode[];
};

const DesignToolsAppPortal = ({ selectedNodes = [] }: Props) => {
  // Make updates to DOM and send API request
  const handleNodeChange = async (
    events: [
      {
        node: FiberNode;
        update: {
          className: string;
          text: string;
        };
      }
    ]
  ) => {
    const event = events[0]; // Allow multiple node changes in future
    const { node } = event;

    // Change DOM element className
    if (node) {
      node.stateNode.className = event.update.className;

      if (event.update.text) {
        node.stateNode.innerText = event.update.text;
      }

      // TODO: Consider separate API for className vs text updates
      const result = await axios.post('/api/component', {
        lineNumber: node._debugSource.lineNumber,
        columnNumber: node._debugSource.columnNumber,
        className: node.stateNode.className,
        text: event.update.text,
        fileName: node._debugSource.fileName,
      });

      console.log(result.data);
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
