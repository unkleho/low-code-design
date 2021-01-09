import React from 'react';
import { Utils, traverse } from 'react-fiber-traverse';

import DesignToolsAppPortal from './DesignToolsAppPortal';

import { DesignToolNode, TargetEvent } from '../types';
import { FiberNode } from 'react-fiber-traverse/dist/mocked-types';

const Wrapper = ({ children }) => {
  // Tree of DesignToolNodes within __preview-container
  const [nodes, setNodes] = React.useState([]);
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const [prevElement, setPrevElement] = React.useState<HTMLElement>();
  // Temp way to force re-render
  const [increment, setIncrement] = React.useState(0);

  React.useEffect(() => {
    // Get highest level React fiber node
    const rootFiberNode = Utils.getRootFiberNodeFromDOM(
      document.getElementById('__next'),
    );

    // Work out #__preview-container fiberNode
    let previewContainerFiberNode;
    traverse(rootFiberNode, (node) => {
      // @ts-ignore
      if (node.stateNode?.id === '__preview-container') {
        previewContainerFiberNode = node;
      }
    });

    // Get all fiberNodes within #__preview-container
    let fiberNodes: FiberNode[] = [];
    traverse(previewContainerFiberNode, (node) => {
      fiberNodes.push(node);
    });

    // Get top level fiberNodes within #__preview-container
    const topPreviewFiberNodes = fiberNodes.filter(
      (n) => n.return === previewContainerFiberNode,
    );

    // Convert FiberNodes to a tree of DesignToolNodes
    const newNodes = topPreviewFiberNodes.map((node) =>
      buildTree(node, fiberNodes),
    );

    setNodes(newNodes);
  }, [increment]);

  return (
    <>
      <div
        id="__preview-container"
        onClick={(event: TargetEvent) => {
          // console.log('Wrapper event');

          // Stop <a> links from navigating away
          event.preventDefault();

          const targetInst = event._targetInst;

          // Skip part of DesignTools
          if (targetInst.stateNode.dataset.id === 'design-tools') {
            return true;
          }

          if (prevElement) {
            prevElement.style.outline = null;
          }

          (event.target as HTMLElement).style.outline = '1px solid cyan';

          setPrevElement(event.target);

          // TODO: set selected DesignToolNodes
          // setSelectedNodes([targetInst]);

          setIncrement(increment + 1);
        }}
      >
        {children}
      </div>

      <DesignToolsAppPortal
        // TODO: Pass in nodes
        selectedNodes={selectedNodes}
        nodes={nodes}
        onNodeChange={() => {
          setIncrement(increment + 1);
        }}
      />
    </>
  );
};

// Traverse root node and build tree of DesignToolNodes
function buildTree(node: FiberNode, allNodes: FiberNode[]): DesignToolNode[] {
  const childNodes = allNodes.filter((n) => n.return === node);

  return {
    tagName: node.elementType as string,
    type: 'element',
    properties: {
      className: node.stateNode.className,
    },
    children: childNodes.map((childNode) => buildTree(childNode, allNodes)),
  };
}

export default Wrapper;
