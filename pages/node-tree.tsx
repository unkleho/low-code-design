import React from 'react';
import NodeTree from '../components/NodeTreeV2';

const NodeTreePage = () => {
  return (
    <div>
      <NodeTree
        children={[
          {
            type: 'element',
            tagName: 'div',
            children: [
              {
                type: 'element',
                tagName: 'p',
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default NodeTreePage;
