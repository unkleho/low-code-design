import React from 'react';

import Panel from './Panel';
import NodeTreeV2 from './NodeTreeV2';

import { DesignToolNode, RehypeNode } from '../types';

type Props = {
  nodes?: RehypeNode[];
  refreshCounter?: number;
  onNodeClick?: (node: DesignToolNode, pathIndexes: number[]) => void;
  onNodeCreateClick?: Function;
};

const LayersPanel = ({
  nodes,
  // refreshCounter,
  onNodeClick,
}: // onNodeCreateClick,
Props) => {
  return (
    <Panel title="Layers" name="layers">
      <div className="py-1">
        <NodeTreeV2 nodes={nodes} onNodeClick={onNodeClick} />
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
