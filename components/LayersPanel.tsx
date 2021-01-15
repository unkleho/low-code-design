import React from 'react';

import Panel from './Panel';
import NodeTreeV2 from './NodeTreeV2';

import { DesignToolNode } from '../types';

type Props = {
  nodes?: DesignToolNode[];
  selectedNodes?: DesignToolNode[];
  refreshCounter?: number;
  onNodeClick?: (node: DesignToolNode, pathIndexes: number[]) => void;
  onNodeCreateClick?: Function;
};

const LayersPanel = ({
  nodes,
  selectedNodes = [],
  // refreshCounter,
  onNodeClick,
}: // onNodeCreateClick,
Props) => {
  return (
    <Panel title="Layers" name="layers">
      <div className="py-1">
        <NodeTreeV2
          nodes={nodes}
          selectedNodes={selectedNodes}
          onNodeClick={onNodeClick}
        />
        {/* <NodeTree
          parentID={rootNode?.return._debugID}
          nodes={nodes}
          selectedIDs={selectedIDs}
          onNodeCreateClick={onNodeCreateClick}
        /> */}
      </div>
    </Panel>
  );
};

export default LayersPanel;
