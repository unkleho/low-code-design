import React from 'react';
import { DesignToolNode } from '../types';

// import Icon from './Icon';

type NodeTreeProps = {
  nodes: DesignToolNode[];
  level?: number;
  pathIndexes?: number[];
  onNodeClick?: (node: DesignToolNode, pathIndexes: number[]) => void;
  onNodeCreateClick?: Function;
};

const NodeTree = ({
  nodes = [],
  level = 0,
  pathIndexes = [],
  onNodeClick,
  onNodeCreateClick,
}: NodeTreeProps) => {
  const displayNodes = nodes.filter((node) => node.type === 'element');

  if (displayNodes.length === 0) {
    return null;
  }

  // const handleNodeCreateClick = (node) => {
  //   if (typeof onNodeCreateClick === 'function') {
  //     onNodeCreateClick(node);
  //   }
  // };

  return (
    <ul className="pl-0 text-xs">
      {displayNodes.map((node, i) => {
        const hasGrandChildren = node.children?.length > 0;
        const childPathIndexes = [...pathIndexes, i];

        return (
          <li className="relative">
            <button
              type="button"
              className={[
                'flex w-full py-1 hover:bg-gray-200',
                node.isSelected ? 'font-bold' : 'font-normal',
                node.isSelected ? 'bg-gray-200' : '',
              ].join(' ')}
              style={{
                paddingLeft: (level + 1) * 12,
              }}
              onClick={() => {
                if (typeof onNodeClick === 'function') {
                  onNodeClick(node, childPathIndexes);
                }

                // if (node.stateNode) {
                //   node.stateNode.click();
                // }
              }}
            >
              {hasGrandChildren ? (
                <span className="mr-1 text-gray-500 text-xs">&#9660;</span>
              ) : (
                <div className="pl-4" />
              )}

              {/* {typeof node.type === 'function' ? node.type.name : node.tagName} */}
              {node.tagName}
            </button>

            {/* {isSelected && (
              <button
                type="button"
                className="absolute top-0 right-0 px-3 py-1 text-gray-500 hover:text-gray-900"
                onClick={() => handleNodeCreateClick(node)}
              >
                <Icon name="plus" />
              </button>
            )} */}

            <NodeTree
              nodes={node.children}
              level={level + 1}
              pathIndexes={childPathIndexes}
              onNodeClick={onNodeClick}
              onNodeCreateClick={onNodeCreateClick}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default NodeTree;
