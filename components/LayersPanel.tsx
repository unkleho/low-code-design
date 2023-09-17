import React from 'react';
import Panel from './Panel';
import NodeTree from './NodeTree';

import { FiberNodeWithId } from '../types';
import {
  getChildNodes,
  getFiberNodeId,
  getReactFiberInstance,
} from '../lib/react-fiber-utils';

// TODO: Updating a file in editor does not trigger layer update. May need to poll,
// or use  websockets

type Props = {
  selectedIds: string[];
  refreshCounter?: number;
  onNodeCreateClick?: Function;
};

const LayersPanel = ({
  selectedIds,
  refreshCounter,
  onNodeCreateClick,
}: Props) => {
  const [nodes, setNodes] = React.useState<FiberNodeWithId[]>([]);

  React.useEffect(() => {
    const coDesignElement = document.getElementById('__codesign');

    if (!coDesignElement) {
      console.warn(
        'Make sure an element with id of __codesign wraps around design',
      );
      return;
    }

    const coDesignFiberNode = getReactFiberInstance(coDesignElement);

    // console.log(
    //   'LayersPanel rootFiberNode',
    //   // rootFiberNode,
    //   coDesignElement,
    //   coDesignFiberNode,
    //   getChildNodes(coDesignFiberNode),
    //   // rootFiberNode.stateNode.containerInfo,
    // );

    const nodes = getChildNodes(coDesignFiberNode);

    // console.log(
    //   'LayersPanel nodes',
    //   nodes.map((node) => {
    //     return {
    //       type: node.elementType,
    //       id: node.id,
    //       parentId: getFiberNodeId(node.return),
    //       key: node.key,
    //       flags: node.flags,
    //       index: node.index,
    //       lanes: node.lanes,
    //       mode: node.mode,
    //       tag: node.tag,
    //       subtreeFlags: node.subtreeFlags,
    //       // returnId: node.return.id,
    //       node,
    //     };
    //   }),
    //   'selectedIds',
    //   selectedIds,
    // );

    setNodes(nodes);
  }, [refreshCounter]);

  return (
    <Panel title="Layers" name="layers">
      <div className="">
        <NodeTree
          nodes={nodes}
          selectedIds={selectedIds}
          onNodeCreateClick={onNodeCreateClick}
        />
      </div>
    </Panel>
  );
};

export default LayersPanel;
