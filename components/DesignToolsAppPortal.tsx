import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import DesignToolsApp from './DesignToolsApp';

import { FiberNode, NodeChangeEvent } from '../types';

type Props = {
  selectedNodes?: FiberNode[];
};

const DesignToolsAppPortal = ({ selectedNodes = [] }: Props) => {
  // Make updates to DOM and send API request
  const handleNodeChange = async (events: NodeChangeEvent[]) => {
    const event = events[0]; // Allow multiple node changes in future
    const { node } = event;

    // Change DOM element className
    if (node) {
      if (event.type === 'UPDATE_FILE_CLASS_NAME') {
        node.stateNode.className = event.className;

        await axios.post('/api/component/class-name', {
          className: event.className,
          fileName: node._debugSource.fileName,
          lineNumber: node._debugSource.lineNumber,
          columnNumber: node._debugSource.columnNumber,
        });

        console.log(event.type, event.className);
      } else if (event.type === 'UPDATE_FILE_TEXT') {
        if (event.text) {
          node.stateNode.innerText = event.text;

          await axios.post('/api/component/text', {
            text: event.text,
            fileName: node._debugSource.fileName,
            lineNumber: node._debugSource.lineNumber,
            columnNumber: node._debugSource.columnNumber,
          });

          console.log(event.type, event.text);
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
