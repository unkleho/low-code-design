import React from 'react';
import { RehypeNode } from '../lib/rehype-utils';

// import Icon from './Icon';

type NodeTreeProps = {
  children: RehypeNode[];
  // selectedIDs: number[];
  level?: number;
  dataId?: string;
  onNodeCreateClick?: Function;
};

const NodeTree = ({
  // parentID,
  children = [],
  // selectedIDs = [],
  level = 0,
  dataId = 'design-tools',
  onNodeCreateClick,
}: NodeTreeProps) => {
  if (children.length === 0) {
    return null;
  }

  // const handleNodeCreateClick = (node) => {
  //   if (typeof onNodeCreateClick === 'function') {
  //     onNodeCreateClick(node);
  //   }
  // };

  return (
    <ul className="pl-0">
      {children.map((node) => {
        // if (!node.type || typeof node.elementType === 'object') {
        //   return null;
        // }

        // const isSelected = selectedIDs.includes(node._debugID);
        // const grandChildNodes = getChildNodes(nodes, node._debugID);
        const hasGrandChildren = node.children?.length > 0;

        return (
          <li data-id={dataId} className="relative">
            <button
              type="button"
              className={[
                'flex w-full py-1 hover:bg-gray-200',
                // isSelected ? 'font-bold' : 'font-normal',
                // isSelected ? 'bg-gray-200' : '',
              ].join(' ')}
              data-id={dataId}
              style={{
                paddingLeft: (level + 1) * 12,
              }}
              // onClick={() => {
              //   if (node.stateNode) {
              //     node.stateNode.click();
              //   }
              // }}
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

            {/* {node.memoizedProps.className} */}
            {/* <NodeTree
              parentID={node._debugID}
              nodes={nodes}
              selectedIDs={selectedIDs}
              level={level + 1}
              onNodeCreateClick={onNodeCreateClick}
            /> */}

            <NodeTree children={node.children} level={level + 1} />
          </li>
        );
      })}
    </ul>
  );
};

export default NodeTree;
