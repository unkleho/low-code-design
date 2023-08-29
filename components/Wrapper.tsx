import React from 'react';

import DesignToolsAppPortal from './DesignToolsAppPortal';

import { FiberNode, TargetEvent } from '../types';
import { getReactFiberInstance } from '../lib/react-fiber-utils';

const Wrapper = ({ children }) => {
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const [prevElement, setPrevElement] = React.useState<HTMLElement>();

  return (
    <>
      <div
        id="__codesign"
        onClick={(event: TargetEvent) => {
          // console.log('Wrapper event', event, event.target);

          // Stop <a> links from navigating away
          event.preventDefault();

          const targetInst = getReactFiberInstance(event.target);

          // Skip part of DesignTools
          if (targetInst?.stateNode.dataset.id === 'design-tools') {
            return true;
          }

          if (prevElement) {
            prevElement.style.outline = null;
          }

          (event.target as HTMLElement).style.outline = '1px solid cyan';

          setPrevElement(event.target);
          setSelectedNodes([targetInst]);
        }}
      >
        {children}
      </div>

      <DesignToolsAppPortal selectedNodes={selectedNodes} />
    </>
  );
};

export default Wrapper;
