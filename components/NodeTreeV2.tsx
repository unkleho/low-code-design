import React from 'react';

import { FiberNode } from '../types';
import Icon from './Icon';

type NodeTreeProps = {
  parentID: number;
  nodes: FiberNode[];
  selectedIDs: number[];
  level?: number;
  dataId?: string;
  onNodeCreateClick?: Function;
};

const getChildNodes = (nodes, parentID) => {
  return nodes.filter((node) => {
    return node.return?._debugID === parentID;
  });
};

const NodeTree = ({
  parentID,
  nodes = [],
  selectedIDs = [],
  level = 0,
  dataId = 'design-tools',
  onNodeCreateClick,
}: NodeTreeProps) => {
  const childNodes = getChildNodes(nodes, parentID);

  if (childNodes.length === 0) {
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

        const isSelected = selectedIDs.includes(node._debugID);
        const grandChildNodes = getChildNodes(nodes, node._debugID);

        return (
          <li key={node._debugID} data-id={dataId} className="relative">
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
                  node.stateNode.click();
                }
              }}
            >
              {grandChildNodes.length > 0 ? (
                <span className="mr-1 text-gray-500 text-xs">&#9660;</span>
              ) : (
                // &#9654; Right Triangle
                // <Icon name="chevron-down" />
                <div className="pl-4" />
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
              parentID={node._debugID}
              nodes={nodes}
              selectedIDs={selectedIDs}
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
