import React from 'react';
import { Utils, traverse } from 'react-fiber-traverse';

import DesignToolsAppPortal from './DesignToolsAppPortal';

import { DesignToolNode, TargetEvent } from '../types';
import { FiberNode } from '../types';
import { getPathIndexes } from '../lib/babel-dom-utils';
import { getSelectedNode } from '../lib/rehype-utils';
import { addSelected } from '../pages/live';

const Wrapper = ({ children }) => {
  // Tree of DesignToolNodes within __preview-container
  const [nodes, setNodes] = React.useState([]);
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const [pathIndexes, setPathIndexes] = React.useState([]);
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
      fiberNodes.push(node as FiberNode);
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
          const { target, currentTarget } = event;

          // Stop <a> links from navigating away
          event.preventDefault();

          // Update highlight element
          if (prevElement) {
            prevElement.style.outline = null;
          }
          (target as HTMLElement).style.outline = '1px solid cyan';
          setPrevElement(target);

          // Work out pathIndexes of target
          const indexes = getPathIndexes(target, currentTarget);
          setPathIndexes(indexes);

          // Work out the selectedNode and set state
          const selectedNode = getSelectedNode(
            { tagName: 'div', type: 'element', children: nodes },
            indexes,
          );
          setSelectedNodes([selectedNode]);

          // Update increment to trigger refresh
          setIncrement(increment + 1);
        }}
      >
        {children}
      </div>

      <DesignToolsAppPortal
        selectedNodes={selectedNodes}
        // TODO: Incorporate `addSelected` into DesignToolsApp?
        nodes={addSelected(nodes, pathIndexes)}
        onNodeChange={() => {
          setIncrement(increment + 1);
        }}
      />
    </>
  );
};

// Traverse root node and build tree of DesignToolNodes from FiberNodes
function buildTree(node: FiberNode, allNodes: FiberNode[]): DesignToolNode {
  const childNodes = allNodes.filter((n) => n.return === node);

  const text =
    typeof node.memoizedProps.children === 'string'
      ? node.memoizedProps.children
      : null;

  return {
    tagName: node.elementType as string,
    type: 'element',
    properties: {
      className: node.stateNode.className.split(' '),
    },
    // children: childNodes.map((childNode) => buildTree(childNode, allNodes)),
    children: text
      ? [
          {
            type: 'text',
            tagName: null,
            value: text,
            children: [],
          },
        ]
      : childNodes.map((childNode) => buildTree(childNode, allNodes)),
    position: {
      start: {
        line: node._debugSource.lineNumber,
        column: node._debugSource.columnNumber,
      },
    },
    fileName: node._debugSource.fileName,
  };
}

export default Wrapper;
