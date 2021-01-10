import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import DesignToolsApp from './DesignToolsApp';
import Icon from './Icon';
import ControlPanel from './ControlPanel';

import { DesignToolNode, FiberNode, NodeChangeEvent } from '../types';
import {
  DesignToolsProvider,
  useDesignTools,
} from '../lib/contexts/design-tools-context';

type Props = {
  selectedNodes?: DesignToolNode[];
  nodes?: DesignToolNode[];
  onNodeChange?: Function;
};

const DesignToolsAppPortal = ({
  selectedNodes = [],
  nodes = [],
  onNodeChange,
}: Props) => {
  const { dispatch } = useDesignTools();
  const [isActive, setIsActive] = React.useState(false);

  // Make updates to DOM and send API request
  const handleNodeChange = async (events: NodeChangeEvent[]) => {
    const event = events[0]; // Allow multiple node changes in future
    const { node } = event;

    // Change DOM element className
    if (node) {
      if (event.type === 'UPDATE_FILE_CLASS_NAME') {
        // TODO: Allow DOM reference to be passed so className can be updated in-browser
        // node.stateNode.className = event.className;

        await axios.post('/api/file/class-name', {
          className: event.className,
          fileName: node.fileName,
          lineNumber: node.position.start.line,
          columnNumber: node.position.start.column,
        });

        console.log(event.type, event.className);
      } else if (event.type === 'UPDATE_FILE_TEXT') {
        if (event.text) {
          // node.stateNode.innerText = event.text;

          // await axios.post('/api/file/text', {
          //   text: event.text,
          //   fileName: node._debugSource.fileName,
          //   lineNumber: node._debugSource.lineNumber,
          //   columnNumber: node._debugSource.columnNumber,
          // });

          console.log(event.type, event.text);
        }
      } else if (event.type === 'CREATE_FILE_ELEMENT') {
        if (event.elementType) {
          // await axios.post('/api/file/element', {
          //   elementType: event.elementType,
          //   fileName: node._debugSource.fileName,
          //   lineNumber: node._debugSource.lineNumber,
          //   columnNumber: node._debugSource.columnNumber,
          // });

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

    if (typeof onNodeChange === 'function') {
      onNodeChange(events);
    }
  };

  if (canUseDOM()) {
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
            nodes={nodes}
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

const DesignToolsAppPortalWrapper = (props: Props) => {
  return (
    <DesignToolsProvider>
      <DesignToolsAppPortal {...props} />
    </DesignToolsProvider>
  );
};

export default DesignToolsAppPortalWrapper;
