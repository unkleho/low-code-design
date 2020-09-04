import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { parse } from '@babel/parser';

import DesignToolsApp from '../components/DesignToolsApp';
import { TargetEvent } from '../types';

const LivePage = () => {
  const [selectedNodes, setSelectedNodes] = React.useState([]);

  const handleDesignToolsSubmit = () => {};

  return (
    <div
      onClick={(event: TargetEvent) => {
        console.log(event._targetInst);
        setSelectedNodes([event._targetInst]);
      }}
    >
      <div className="flex justify-center items-center flex-col">
        <LiveProvider
          code={'<strong className="uppercase">Hello World!</strong>'}
          transformCode={(code) => {
            const test = parse(code, {
              plugins: ['jsx'],
            });
            // console.log(test);
            // return code.replace('data', '');
            return code;
          }}
        >
          <LiveEditor />
          <LiveError />
          <LivePreview />
        </LiveProvider>
      </div>
      <DesignToolsApp
        selectedNodes={selectedNodes}
        onSubmit={handleDesignToolsSubmit}
      />
    </div>
  );
};

export default LivePage;
