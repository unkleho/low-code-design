import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
// import { parse } from '@babel/parser';
// import traverse from '@babel/traverse';

import DesignToolsApp from '../components/DesignToolsApp';
import { DesignToolsProvider } from '../lib/contexts/design-tools-context';
import { TargetEvent } from '../types';

const defaultCode =
  '<div><strong className="uppercase">Hello World!</strong><p>Some text</p></div>';

const LivePage = () => {
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const [code, setCode] = React.useState(defaultCode);

  const handleDesignToolsSubmit = (events) => {
    const event = events[0]; // Allow multiple node changes in future
    const { node, update } = event;

    // Change DOM element className
    if (node && update) {
      console.log(node.stateNode, update);
      node.stateNode.className = event.update.className;

      // TODO: Update code with new className
      // OPTION:
      // 1. Store node location in dom tree in state, set by onClick div wrapper over LivePreview
      // 2. Location could look like tree[0][1] ie first child, second grandchild
      // 3. Parse code and get AST
      // 4. Use tree state to look up AST
      // 5. Update className
      // 6. Unparse and get code back from AST
    }
  };

  return (
    <DesignToolsProvider>
      <div>
        <div className="flex justify-center items-center flex-col">
          <LiveProvider
            code={code}
            transformCode={(code2) => {
              // Find starting tag and add data attribute
              // [^/] = not forward slash (/), as we don't want end tag (</sometag>)
              // \w = any alphanumeric character
              const newCode = code2.replace(
                /(<[^/]\w*)/i,
                '$1 data-id="1234" '
              );
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

            <div
              onClick={(event: TargetEvent) => {
                console.log(event._targetInst);
                setSelectedNodes([event._targetInst]);
              }}
            >
              <LivePreview />
            </div>
          </LiveProvider>
        </div>

        <DesignToolsApp
          selectedNodes={selectedNodes}
          onNodeChange={handleDesignToolsSubmit}
        />
      </div>
    </DesignToolsProvider>
  );
};

export default LivePage;
