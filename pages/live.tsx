import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

import DesignToolsApp from '../components/DesignToolsApp';
import { TargetEvent } from '../types';

const defaultCode = '<strong className="uppercase">Hello World!</strong>';

const LivePage = () => {
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const [code, setCode] = React.useState(defaultCode);

  const handleDesignToolsSubmit = (events) => {
    const event = events[0]; // Allow multiple node changes in future
    const { node, update } = event;

    console.log(node.stateNode, update);

    // Change DOM element className
    if (node) {
      node.stateNode.className = event.update.className;

      // const result = await axios.post('/api/component', {
      //   lineNumber: node._debugSource.lineNumber,
      //   columnNumber: node._debugSource.columnNumber,
      //   className: node.stateNode.className,
      //   fileName: node._debugSource.fileName,
      // });

      // console.log(result.data);
    }
  };

  return (
    <div>
      <div
        className="flex justify-center items-center flex-col"
        onClick={(event: TargetEvent) => {
          console.log(event._targetInst);
          setSelectedNodes([event._targetInst]);
        }}
      >
        <LiveProvider
          code={code}
          transformCode={(code2) => {
            // Find starting tag and add data attribute
            // [^/] = not forward slash (/), as we don't want end tag (</sometag>)
            // \w = any alphanumeric character
            const newCode = code2.replace(/(<[^/]\w*)/i, '$1 data-id="1234" ');
            console.log(newCode);

            // const ast = parse(code2, {
            //   plugins: ['jsx'],
            // });

            // traverse(ast, {
            //   enter(path) {
            //     if (path.container.type === 'JSXOpeningElement') {
            //       console.log(path);
            //       path.container.attributes.push({
            //         name: {
            //           name: 'test',
            //           type: 'JSXIdentifier',
            //         },
            //       });
            //     }
            //   },
            // });

            // console.log(test);
            // return code.replace('data', '');
            return newCode;
          }}
        >
          <LiveEditor />
          <LiveError />
          <LivePreview />
        </LiveProvider>

        <div className="">Test</div>
      </div>

      <DesignToolsApp
        selectedNodes={selectedNodes}
        onSubmit={handleDesignToolsSubmit}
      />
    </div>
  );
};

export default LivePage;
