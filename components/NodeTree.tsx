import React from 'react';

import { FiberNode, FiberNodeWithId } from '../types';
import Icon from './Icon';
import { getChildNodes } from '../lib/react-fiber-utils';

type NodeTreeProps = {
  // parentId: string;
  nodes: FiberNodeWithId[];
  selectedIds: string[];
  level?: number;
  dataId?: string;
  onNodeCreateClick?: Function;
};

/** Prevent recursive component going forever */
const MAX_DEPTH = 6;
/** TODO: Pass this through as a config? `i` is a production name for React component */
export const nodeTypesToSkip = ['RehypeRootComponent', 'RehypeComponent', 'i'];

export function getNodeType(node: FiberNode) {
  return typeof node.type === 'function' ? node.type.name : node.type;
}

export function shouldSkipNode(node: FiberNode) {
  if (typeof node.type === 'function') {
    return nodeTypesToSkip.includes(node.type.name);
  }

  return false;
}

const NodeTree = ({
  // parentId,
  nodes = [],
  selectedIds = [],
  level = 0,
  dataId = 'design-tools',
  onNodeCreateClick,
}: NodeTreeProps) => {
  // const childNodes = getChildNodes(nodes, parentId);
  // console.log('nodeTree', parentId, nodes);

  if (nodes.length === 0 || level > MAX_DEPTH) {
    return null;
  }

  // if (level === 6) {
  //   console.log('NodeTree', nodes, getFiberNodeId2(nodes[0]));
  // }

  // console.log('nodeTree nodes', nodes);

  const handleNodeCreateClick = (node) => {
    if (typeof onNodeCreateClick === 'function') {
      onNodeCreateClick(node);
    }
  };

  return (
    <ul className="pl-0">
      {nodes.map((node) => {
        if (!node.elementType || typeof node.elementType === 'object') {
          return null;
        }

        const isSelected = selectedIds.includes(node.id);
        const childNodes = getChildNodes(node);
        // TODO
        const grandChildNodes = [];
        const type = getNodeType(node);
        // const grandChildNodes = getChildNodes(nodes, node.id);

        if (shouldSkipNode(node)) {
          return (
            <NodeTree
              key={node.id}
              nodes={childNodes}
              selectedIds={selectedIds}
              level={level}
              onNodeCreateClick={onNodeCreateClick}
            />
          );
        }

        return (
          <li key={node.id} data-id={dataId} className="relative">
            <button
              type="button"
              className={[
                'flex w-full py-1 hover:bg-gray-200',
                isSelected ? 'font-bold' : 'font-normal',
                isSelected ? 'bg-gray-200' : '',
              ].join(' ')}
              data-id={dataId}
              style={{
                paddingLeft: level * 12,
              }}
              onClick={() => {
                if (node.stateNode) {
                  console.log('nodeClick', node);
                  node.stateNode.click();
                }
              }}
            >
              {grandChildNodes.length > 0 ? (
                <span className="mr-1 text-gray-500 text-xs">&#9660;</span>
              ) : (
                // &#9654; Right Triangle
                // <Icon name="chevron-down" />
                <span className="pl-4" />
              )}
              {type}
            </button>

            {isSelected && (
              <button
                type="button"
                className="absolute top-0 right-0 px-3 py-1 text-gray-500 hover:text-gray-900"
                onClick={() => handleNodeCreateClick(node)}
              >
                <Icon name="plus" />
              </button>
            )}

            {/* {node.memoizedProps.className} */}
            <NodeTree
              // parentId={node.id}
              // nodes={nodes}
              nodes={childNodes}
              selectedIds={selectedIds}
              level={level + 1}
              onNodeCreateClick={onNodeCreateClick}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default NodeTree;
