import React from 'react';
// import { Utils, traverse } from 'react-fiber-traverse';

import Panel from './Panel';
import NodeTree from './NodeTree';

import { FiberNode, FiberNodeWithId } from '../types';
import { getRootFiberNodeFromDOM } from '../lib/react-fiber-traverse/src/utils';
import { traverse } from '../lib/react-fiber-traverse/src';
import {
  getFiberNodeId,
  getReactFiberInstance,
} from '../lib/react-fiber-utils';
import { FiberNodeDOMContainer } from '../lib/react-fiber-traverse/src/mocked-types';

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
  const rootNode = nodes[0];

  console.log('selectedIds', selectedIds);

  React.useEffect(() => {
    // const rootFiberNode = getRootFiberNodeFromDOM(
    //   document.getElementById('__next'),
    // );

    // Doesn't work for some reason
    // const mainFiberNode = findNodeByComponentRef(rootFiberNode, ref.current);

    let rootKey;
    const rootElement = document.getElementById('__next');
    for (const key of Object.keys(rootElement)) {
      if (key.startsWith('__reactContainer$')) {
        rootKey = key;
      }
    }
    const rootFiberNode = rootElement[rootKey];

    const coDesignElement = document.getElementById('__codesign');

    const coDesignFiberNode = getReactFiberInstance(coDesignElement);

    // console.log(
    //   'LayersPanel rootFiberNode',
    //   rootFiberNode,
    //   coDesignElement,
    //   coDesignFiberNode,
    //   // rootFiberNode.stateNode.containerInfo,
    // );

    let isDesignTools = false;
    let nodes: FiberNode[] = [];

    // Traverse fiber node tree, adding each one to nodes.
    // TODO: Only add nodes within Wrapper
    traverse(coDesignFiberNode, (node: FiberNode) => {
      if (!node) {
        return;
      }

      // console.log(
      //   'LayersPanel traverse containerInfo',
      //   // @ts-ignore
      //   node,
      // );

      // @ts-ignore
      if (node.stateNode?.id === '__codesign' || isDesignTools) {
        // console.log('LayersPanel traverse', node);
        isDesignTools = true;

        // @ts-ignore
        if (node.stateNode?.id !== '__codesign') {
          nodes.push(node);
        }
      }
    });

    // Filter out DesignTools, otherwise we are inspecting the UI that is inspecting the UI
    // TODO: Just removing the top DesignTools for now, but should remove child nodes too for performance

    const nodesWithId = nodes.map((node) => {
      return {
        ...node,
        id: getFiberNodeId(node),
        return: {
          ...node.return,
          id: getFiberNodeId(node.return),
        },
      };
    });

    console.log(
      'LayersPanel nodes',
      nodesWithId.map((node) => {
        return {
          id: node.id,
          parentId: getFiberNodeId(node.return),
          key: node.key,
          flags: node.flags,
          index: node.index,
          lanes: node.lanes,
          mode: node.mode,
          tag: node.tag,
          type: node.elementType,
          subtreeFlags: node.subtreeFlags,
          returnId: node.return.id,
        };
      }),
      'selectedIds',
      selectedIds,
    );

    // setNodes(nodes.filter((node) => node.type?.name !== 'DesignTools'));
    setNodes(nodesWithId);

    // console.log(rootFiberNode);
    // console.log(mainFiberNode);
  }, [refreshCounter]);

  // console.log('nodes with id', nodes);

  return (
    <Panel title="Layers" name="layers">
      <div className="py-1">
        <NodeTree
          parentId={rootNode ? getFiberNodeId(rootNode.return) : null}
          nodes={nodes}
          selectedIds={selectedIds}
          onNodeCreateClick={onNodeCreateClick}
        />
      </div>
    </Panel>
  );
};

export default LayersPanel;
