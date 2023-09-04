import React, { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { FiberNode, NodeChangeEvent, TargetEvent } from '../types';
import DesignToolsApp from '../components/DesignToolsApp';
import { DesignToolsProvider } from '../lib/contexts/design-tools-context';
import {
  parseCode,
  updateNodeClass,
  updateNodeText,
} from '../lib/rehype-utils';
import RehypeRootComponent from '../components/RehypeComponent';
import { getReactFiberInstance } from '../lib/react-fiber-utils';
import {
  changeHighlightElement,
  getPathIndexes,
} from '../lib/html-element-utils';

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
  const [isClient, setIsClient] = useState(false);

  const highlightElement = React.useRef<HTMLDivElement>();
  // Top level preview element
  const previewElement =
    typeof window === 'undefined'
      ? null
      : document.getElementById('__codesign');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // useEffect(() => {
  //   changeHighlightElement(
  //     previewElement,
  //     highlightElement.current,
  //     pathIndexes,
  //   );
  // }, []);

  const handleDesignToolsChange = (events: NodeChangeEvent[]) => {
    console.log('handleDesignToolsChange', events[0]);

    const event = events[0]; // Allow multiple node changes in future
    const { node } = event;

    const pathIndexes = getPathIndexes(node?.stateNode);

    if (!node) {
      return null;
    }

    changeHighlightElement(
      previewElement,
      highlightElement.current,
      pathIndexes,
    );

    // Change node className
    if (event.type === 'UPDATE_FILE_CLASS_NAME') {
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
    <DesignToolsProvider>
      <div className="livePage h-screen overflow-hidden">
        <div className="fixed" ref={highlightElement}></div>

        <header className="header p-3 border-b-4">
          <h1 className="text-sm uppercase text-gray-800 font-bold">
            {`<>`} Low Code Design <span className="font-normal">/ Demo</span>
          </h1>
        </header>

        <div
          // NOTE: This works but doesn't create React nodes properly
          // dangerouslySetInnerHTML={{
          //   __html: code,
          // }}
          // id="preview"
          id="__codesign"
          className="preview flex flex-col items-center justify-center bg-gray-100"
          onClick={(event: TargetEvent) => {
            // Stop <a> links from navigating away
            event.preventDefault();

            console.log(event);

            const targetInst = getReactFiberInstance(event.target);

            // const { target, currentTarget } = event;
            // const indexes = getPathIndexes(target, currentTarget);
            // setPathIndexes(indexes);

            // const selectedNode = getSelectedNode(rootRehypeNode, indexes);
            // setSelectedNodes([selectedNode]);

            // Set selected nodes for DesignToolsApp
            setSelectedNodes([targetInst]);
          }}
        >
          <RehypeRootComponent children={rootRehypeNode.children} />
        </div>

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
              minimap: {
                enabled: false,
              },
            }}
            onChange={(value, event) => {
              setCode(value);
            }}
          />
        </div>

        <DesignToolsApp
          selectedNodes={selectedNodes}
          className={[
            'designTools',
            'max-h-full h-screen overflow-auto border-r-4',
          ].join(' ')}
          // onNodeClick={(node, pathIndexes) => {
          //   setPathIndexes(pathIndexes);
          //   // TODO: Update className, text and tagType in DesignToolsApp
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
    </DesignToolsProvider>
  );
};

export default EditorPage;
