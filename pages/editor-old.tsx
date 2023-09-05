import React from 'react';
import { Editor } from '@monaco-editor/react';

import DesignToolsApp from '../components/CodesignSidebar';
import RehypeComponent from '../components/RehypeComponent';
import { CodesignProvider } from '../lib/contexts/codesign-context';

import { TargetEvent } from '../types';
import {
  getAncestorsIndexes,
  getSelectedElement,
} from '../lib/babel-dom-utils';
import useWindowSize from '../lib/hooks/use-window-size';
import { parseCode, updateNodeClass } from '../lib/rehype-utils';
import { getReactFiberInstance } from '../lib/react-fiber-utils';

const defaultCode = `<div id="hello"><strong class="uppercase">Hello World!</strong><p>Some text</p>
  <div><p>Deep text</p></div>
  </div>`;

const LivePage = () => {
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const [code, setCode] = React.useState(defaultCode);

  const [ancestorIndexes, setAncestorIndexes] = React.useState<number[]>();

  const highlightElement = React.useRef<HTMLDivElement>();

  // Top level preview element
  const previewElement =
    typeof window === 'undefined' ? null : document.getElementById('preview');

  const rootRehypeNode = parseCode(code);
  // console.log(rootRehypeNode);

  React.useEffect(() => {
    const element = getSelectedElement(previewElement, ancestorIndexes);

    if (element) {
      const { top, left, width, height } = element.getBoundingClientRect();

      updateHighlightElement(highlightElement.current, {
        top,
        left,
        width,
        height,
      });
    }
  }, [rootRehypeNode]);

  useWindowSize(() => {
    const element = getSelectedElement(previewElement, ancestorIndexes);

    if (element) {
      const { top, left, width, height } = element.getBoundingClientRect();

      updateHighlightElement(highlightElement.current, {
        top,
        left,
        width,
        height,
      });
    }
  });

  // TODO: Type events
  const handleDesignToolsSubmit = (events) => {
    console.log('design-tools', events);

    const event = events[0]; // Allow multiple node changes in future
    const { node, type, className } = event;

    // Change node className
    if (node && type === 'UPDATE_FILE_CLASS_NAME') {
      // Parse code and turn it into an AST
      const newCode = updateNodeClass(code, ancestorIndexes, className);

      setCode(newCode);
    }
  };

  return (
    <CodesignProvider>
      <div className="livePage h-screen overflow-hidden">
        <div className="fixed" ref={highlightElement}></div>
        <div
          // NOTE: This works but doesn't create React nodes properly
          // dangerouslySetInnerHTML={{
          //   __html: code,
          // }}
          id="preview"
          className="preview flex flex-col items-center justify-center"
          onClick={(event: TargetEvent) => {
            // Stop <a> links from navigating away
            event.preventDefault();

            const { target, currentTarget } = event;
            const element = target;
            const indexes = getAncestorsIndexes(target, currentTarget);
            setAncestorIndexes(indexes);

            const {
              top,
              left,
              width,
              height,
            } = element.getBoundingClientRect();

            updateHighlightElement(highlightElement.current, {
              top,
              left,
              width,
              height,
            });

            const targetInst = getReactFiberInstance(event.target);

            // Set selected nodes for DesignToolsApp
            setSelectedNodes([targetInst]);
          }}
        >
          <RehypeComponent children={rootRehypeNode.children} />
        </div>

        <div className="editor border-t-4">
          <Editor
            // height="50vh"
            language="html"
            // theme="dark"
            value={code}
            options={{
              minimap: {
                enabled: false,
              },
            }}
            onChange={(value, event) => {
              console.log(event, value);
              setCode(value);
            }}
          />
        </div>

        <DesignToolsApp
          // TODO: Reconsider the type of selectedNodes, currently it is a [_targetIinst], a React specific data structure. Perhaps a simple AST will suffice
          selectedNodes={selectedNodes}
          className={[
            'designTools',
            'max-h-full h-screen overflow-auto border-r-4',
          ].join(' ')}
          onNodeChange={handleDesignToolsSubmit}
        />
      </div>

      <style>{`
      .livePage {
        display: grid;
        grid-template-areas: 
          "designTools preview"
          "designTools editor";
        grid-template-rows: 1fr 1fr;
        grid-template-columns: auto 1fr;
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
    </CodesignProvider>
  );
};

function updateHighlightElement(element, { top, left, width, height }) {
  // Had to go vanilla JS, tried my hardest with useState and useRef, but it either caused infinite loop or didn't work.
  element.style.outline = `1px solid cyan`;
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  element.style.pointerEvents = `none`;
}

export default LivePage;
