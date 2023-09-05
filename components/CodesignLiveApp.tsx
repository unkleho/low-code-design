import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import DesignToolsApp from './CodesignSidebar';
import Icon from './Icon';
import ControlPanel from './ControlPanel';

import { FiberNode, NodeChangeEvent } from '../types';
import {
  CodesignProvider,
  useCodesign,
} from '../lib/contexts/codesign-context';

type Props = {
  selectedNodes?: FiberNode[];
};

const CodesignLiveApp = ({ selectedNodes = [] }: Props) => {
  const { dispatch } = useCodesign();
  const [isActive, setIsActive] = React.useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Make updates to DOM and send API request
  const handleNodeChange = async (events: NodeChangeEvent[]) => {
    const event = events[0]; // Allow multiple node changes in future
    const { node } = event;

    // Change DOM element className
    if (node) {
      if (event.type === 'UPDATE_FILE_CLASS_NAME') {
        node.stateNode.className = event.className;

        await axios.post('/api/file/class-name', {
          className: event.className,
          fileName: node._debugSource.fileName,
          lineNumber: node._debugSource.lineNumber,
          columnNumber: node._debugSource.columnNumber,
        });

        console.log(event.type, event.className);
      } else if (event.type === 'UPDATE_FILE_TEXT') {
        if (event.text) {
          node.stateNode.innerText = event.text;

          await axios.post('/api/file/text', {
            text: event.text,
            fileName: node._debugSource.fileName,
            lineNumber: node._debugSource.lineNumber,
            columnNumber: node._debugSource.columnNumber,
          });

          console.log(event.type, event.text);
        }
      } else if (event.type === 'CREATE_FILE_ELEMENT') {
        if (event.elementType) {
          await axios.post('/api/file/element', {
            elementType: event.elementType,
            fileName: node._debugSource.fileName,
            lineNumber: node._debugSource.lineNumber,
            columnNumber: node._debugSource.columnNumber,
          });

          console.log(event.type, event.elementType);

          // Delay refresh otherwise layers panel can't pick up new dom nodes in time
          setTimeout(() => {
            dispatch({
              type: 'REFRESH_LAYERS_PANEL',
            });
          }, 1000);
        }
      }
    }
  };

  if (isClient) {
    return ReactDOM.createPortal(
      <>
        {!isActive && (
          <div className="absolute top-0 p-2">
            <button
              className="p-1 bg-gray-400 rounded-lg"
              onClick={() => {
                setIsActive(true);
              }}
            >
              <Icon name="chevron-right" />
            </button>
          </div>
        )}

        <aside
          className={[
            'absolute top-0 overflow-auto max-h-full transition-all duration-300',
            isActive ? '' : '-ml-64',
          ].join(' ')}
        >
          <ControlPanel
            onClick={() => {
              setIsActive(false);
            }}
          />

          <DesignToolsApp
            selectedNodes={selectedNodes}
            onNodeChange={handleNodeChange}
          />
        </aside>
      </>,
      document.body,
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

const CodesignLiveAppWrapper = (props: Props) => {
  return (
    <CodesignProvider>
      <CodesignLiveApp {...props} />
    </CodesignProvider>
  );
};

export default CodesignLiveAppWrapper;
