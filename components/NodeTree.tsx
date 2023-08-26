import React from 'react';

import { FiberNode, FiberNodeWithId } from '../types';
import Icon from './Icon';
import { getFiberNodeId } from '../lib/react-fiber-utils';

type NodeTreeProps = {
  parentId: string;
  nodes: FiberNodeWithId[];
  selectedIds: string[];
  level?: number;
  dataId?: string;
  onNodeCreateClick?: Function;
};

/** Prevent recursive component going forever */
const MAX_DEPTH = 100;

const getChildNodes = (nodes: FiberNodeWithId[], parentId) => {
  return nodes.filter((node) => {
    const id = getFiberNodeId(node.return);
    return id === parentId;
  });
};

const NodeTree = ({
  parentId,
  nodes = [],
  selectedIds = [],
  level = 0,
  dataId = 'design-tools',
  onNodeCreateClick,
}: NodeTreeProps) => {
  const childNodes = getChildNodes(nodes, parentId);
  console.log('nodeTree', parentId, childNodes);

  if (childNodes.length === 0 || level > MAX_DEPTH) {
    return null;
  }

  const handleNodeCreateClick = (node) => {
    if (typeof onNodeCreateClick === 'function') {
      onNodeCreateClick(node);
    }
  };

  return (
    <ul className="pl-0">
      {childNodes.map((node) => {
        if (!node.elementType || typeof node.elementType === 'object') {
          return null;
        }

        const isSelected = selectedIds.includes(node.id);
        const grandChildNodes = getChildNodes(nodes, node.id);

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
                paddingLeft: (level + 1) * 12,
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

              {typeof node.type === 'function' ? node.type.name : node.type}
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
              parentId={node.id}
              nodes={nodes}
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
