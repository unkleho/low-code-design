import React from 'react';

import CodesignLiveApp from './CodesignLiveApp';

import { TargetEvent } from '../types';
import { getReactFiberInstance } from '../lib/react-fiber-utils';

const CodesignLiveAppWrapper = ({ children }) => {
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const [prevElement, setPrevElement] = React.useState<HTMLElement>();

  return (
    <>
      <div
        id="__codesign"
        onClick={(event: TargetEvent) => {
          // console.log('CodesignLiveAppWrapper event', event, event.target);

          // Stop <a> links from navigating away
          event.preventDefault();

          const targetInst = getReactFiberInstance(event.target);

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

      <CodesignLiveApp selectedNodes={selectedNodes} />
    </>
  );
};

export default CodesignLiveAppWrapper;
