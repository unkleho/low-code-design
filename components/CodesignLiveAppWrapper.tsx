import React from 'react';

import CodesignLiveApp from './CodesignLiveApp';

import { getReactFiberInstance } from '../lib/react-fiber-utils';
import { CodesignWorkArea } from './CodesignWorkArea';

const CodesignLiveAppWrapper = ({ children }) => {
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const [prevElement, setPrevElement] = React.useState<HTMLElement>();

  return (
    <>
      <CodesignWorkArea
        onClick={(event) => {
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
      </CodesignWorkArea>

      <CodesignLiveApp selectedNodes={selectedNodes} />
    </>
  );
};

export default CodesignLiveAppWrapper;
