import React from 'react';

import { CodesignMode, FiberNode, FiberNodeWithId } from '../types';
import Icon from './Icon';
import { getChildNodes } from '../lib/react-fiber-utils';

type NodeTreeProps = {
  // parentId: string;
  nodes: FiberNodeWithId[];
  selectedIds: string[];
  level?: number;
  dataId?: string;
  mode?: CodesignMode;
  onNodeCreateClick?: Function;
};

/** Prevent recursive component going forever */
const MAX_DEPTH = 10;

export function getNodeType(node: FiberNode) {
  return typeof node.type === 'function' ? node.type.name : node.type;
}

export function shouldSkipNode(node: FiberNode, mode: CodesignMode) {
  /** TODO: Although `i` is a production name for React component, it does change */
  const nodeTypesToSkip = ['RehypeRootComponent', 'RehypeComponent', 'i'];

  // Skip all React components in layers panel
  if (typeof node.type === 'function' && mode === 'live') {
    // return nodeTypesToSkip.includes(node.type.name);
    return true;
  }

  return false;
}

const NodeTree = ({
  nodes = [],
  selectedIds = [],
  level = 0,
  dataId = 'design-tools',
  mode = 'live',
  onNodeCreateClick,
}: NodeTreeProps) => {
  if (nodes.length === 0 || level > MAX_DEPTH) {
    return null;
  }

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

        if (shouldSkipNode(node, mode)) {
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
                'flex w-full py-1 hover:bg-blue-100',
                isSelected ? 'font-bold' : 'font-normal',
                isSelected ? 'bg-blue-100' : '',
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
