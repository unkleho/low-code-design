import React, { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { FiberNode, NodeChangeEvent, TargetEvent } from '../types';
import CodesignSidebar from '../components/CodesignSidebar';
import {
  parseCode,
  updateNodeClass,
  updateNodeText,
} from '../lib/rehype-utils';
import RehypeRootComponent from '../components/RehypeComponent';
import { getReactFiberInstance } from '../lib/react-fiber-utils';
import { getPathIndexes } from '../lib/html-element-utils';
import { CodesignWorkArea } from '../components/CodesignWorkArea';

const defaultCode = `<article class="w-64 bg-white p-6 rounded-lg shadow-xl">
  <p class="mb-4 text-sm uppercase text-gray-500">Total</p>
  <h1 class="text-4xl text-gray-800 font-bold leading-tight">77%</h1>
  <p class="mb-2 text-sm text-teal-400">+13%</p>

  <div class="relative">
    <div class="absolute w-full h-1 bg-gray-200"></div>
    <div class="absolute t-0 w-3/4 h-1 bg-pink-500"></div>
  </div>
</article>`;

const EditorPage = () => {
  const [code, setCode] = React.useState(defaultCode);
  const [selectedNodes, setSelectedNodes] = React.useState<FiberNode[]>([]);
  // const [pathIndexes, setPathIndexes] = React.useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Not sure if needed
  // useEffect(() => {
  //   if (highlightElement) {
  //     changeHighlightElement(
  //       previewElement,
  //       highlightElement.current,
  //       pathIndexes,
  //     );
  //   }
  // }, [code]);

  const handleDesignToolsChange = (events: NodeChangeEvent[]) => {
    console.log('Editor Page', 'handleDesignToolsChange', events[0]);

    const event = events[0]; // Allow multiple node changes in future
    const { node } = event;

    const pathIndexes = getPathIndexes(node?.stateNode);
    // setPathIndexes(pathIndexes);

    if (!node) {
      return null;
    }

    // TODO: Add a select element/node type
    if (event.type === 'UPDATE_FILE_CLASS_NAME') {
      // Change node className
      const newCode = updateNodeClass(code, pathIndexes, event.className);

      setCode(newCode);
    } else if (event.type === 'UPDATE_FILE_TEXT') {
      const newCode = updateNodeText(code, pathIndexes, event.text);
      setCode(newCode);
    }
  };

  if (!isClient) {
    return null;
  }

  // Convert code to AST
  const rootRehypeNode = parseCode(code);

  return (
    <>
      <div className="livePage h-screen overflow-hidden">
        {/* <div className="fixed" ref={highlightElement}></div> */}

        <header className="header p-3 border-b-4">
          <h1 className="text-sm uppercase text-gray-800 font-bold">
            {`<>`} Low Code Design <span className="font-normal">/ Demo</span>
          </h1>
        </header>

        <CodesignWorkArea
          className="preview flex flex-col items-center justify-center bg-gray-100"
          onClick={(event) => {
            const targetInst = getReactFiberInstance(event.target);

            // Set selected nodes for CodesignSidebar
            setSelectedNodes([targetInst]);
          }}
        >
          <RehypeRootComponent children={rootRehypeNode.children} />
        </CodesignWorkArea>

        <div
          className="editor border-t-4"
          style={{
            // Doesn't shrink properly without this
            // https://github.com/suren-atoyan/monaco-react/issues/27
            overflow: 'hidden',
          }}
        >
          <Editor
            language="html"
            // theme="dark"
            value={code}
            options={{
              minimap: { enabled: false },
            }}
            onChange={(value, event) => {
              setCode(value);
            }}
          />
        </div>

        <CodesignSidebar
          selectedNodes={selectedNodes}
          className={[
            'designTools',
            'max-h-full h-screen overflow-auto border-r-4',
          ].join(' ')}
          // onNodeClick={(node, pathIndexes) => {
          //   setPathIndexes(pathIndexes);
          //   // TODO: Update className, text and tagType in CodesignSidebar
          // }}
          onNodeChange={handleDesignToolsChange}
        />
      </div>

      <style>{`
      .livePage {
        display: grid;
        grid-template-areas: 
          "header header"
          "designTools preview"
          "designTools editor";
        grid-template-rows: auto 1fr 1fr;
        grid-template-columns: auto 1fr;
      }

      .header {
        grid-area: header;
      }

      .preview {
        grid-area: preview;
      }

      .editor {
        grid-area: editor;
      }

      .designTools {
        grid-area: designTools;
      }
      `}</style>
    </>
  );
};

export default EditorPage;
