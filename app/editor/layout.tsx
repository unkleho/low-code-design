'use client';

import { useState } from 'react';
import { FiberNode, NodeChangeEvent } from '../../types';
import { CodesignWorkArea } from '../../components/CodesignWorkArea';
import { getReactFiberInstance } from '../../lib/react-fiber-utils';
import RehypeRootComponent from '../../components/RehypeComponent';
import {
  parseCode,
  updateNodeClass,
  updateNodeText,
} from '../../lib/rehype-utils';
import { Editor } from '@monaco-editor/react';
import CodesignSidebar from '../../components/CodesignSidebar';
import { getPathIndexes } from '../../lib/html-element-utils';
import { useIsClient } from '../../lib/hooks/use-is-client';
import { useParams } from 'next/navigation';

const defaultCode = `<article class="w-64 bg-white p-6 rounded-lg shadow-xl">
  <p class="mb-4 text-sm uppercase text-gray-500">Total</p>
  <h1 class="text-4xl text-gray-800 font-bold leading-tight">77%</h1>
  <p class="mb-2 text-sm text-teal-400">+13%</p>

  <div class="relative">
    <div class="absolute w-full h-1 bg-gray-200"></div>
    <div class="absolute t-0 w-3/4 h-1 bg-pink-500"></div>
  </div>
</article>`;

export function EditorLayout({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState(defaultCode);
  const [selectedNodes, setSelectedNodes] = useState<FiberNode[]>([]);
  // const params = useParams();
  // console.log('EditorLayout', { params });

  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  const handleDesignToolsChange = (events: NodeChangeEvent[]) => {
    console.log('EditorLayout', 'handleDesignToolsChange', events[0]);

    const event = events[0]; // Allow multiple node changes in future
    const { node } = event;

    const pathIndexes = getPathIndexes(node?.stateNode);

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

  // Convert code to AST
  const rootRehypeNode = parseCode(code);

  return (
    <div className="livePage h-screen overflow-hidden">
      <header className="header p-3 bg-gray-800">
        <h1 className="text-sm uppercase text-gray-200 font-bold ">
          {`<>`} Low Code Design <span className="font-normal">/ Demo</span>
        </h1>
      </header>

      {children}

      <CodesignSidebar
        selectedNodes={selectedNodes}
        className={[
          'designTools',
          'max-h-full h-screen overflow-auto border-r',
        ].join(' ')}
        onNodeChange={handleDesignToolsChange}
      />

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
        className="editor border-t"
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
    </div>
  );
}

export default EditorLayout;
