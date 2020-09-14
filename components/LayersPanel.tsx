import React from 'react';
import { Utils, traverse } from 'react-fiber-traverse';

import Panel from './Panel';
import NodeTree from './NodeTree';

import { FiberNode } from '../types';

type Props = {
  selectedIDs: number[];
};

const LayersPanel = ({ selectedIDs }: Props) => {
  const [nodes, setNodes] = React.useState<FiberNode[]>([]);
  const rootNode = nodes[0];

  React.useEffect(() => {
    const rootFiberNode = Utils.getRootFiberNodeFromDOM(
      document.getElementById('__next')
    );

    // Doesn't work for some reason
    // const mainFiberNode = findNodeByComponentRef(rootFiberNode, ref.current);

    let isDesignTools = false;
    let nodes = [];

    // Traverse fiber node tree, adding each one to nodes.
    // TODO: Only add nodes within Wrapper
    traverse(rootFiberNode, (node) => {
      if (node.stateNode?.id === '__codesign' || isDesignTools) {
        isDesignTools = true;

        if (node.stateNode?.id !== '__codesign') {
          nodes.push(node);
        }
      }
    });

    // Filter out DesignTools, otherwise we are inspecting the UI that is inspecting the UI
    // TODO: Just removing the top DesignTools for now, but should remove child nodes too for performance
    setNodes(nodes.filter((node) => node.type?.name !== 'DesignTools'));

    // console.log(rootFiberNode);
    // console.log(mainFiberNode);
  }, []);

  return (
    <Panel title="Layers" name="layers">
      <div className="py-1">
        <NodeTree
          parentID={rootNode?.return._debugID}
          nodes={nodes}
          selectedIDs={selectedIDs}
        />
      </div>
    </Panel>
  );
};

export default LayersPanel;
