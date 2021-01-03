import React from 'react';
import { ControlledEditor } from '@monaco-editor/react';

import DesignToolsApp from '../components/DesignToolsApp';
import RehypeComponent from '../components/RehypeComponent';
import { DesignToolsProvider } from '../lib/contexts/design-tools-context';

import { DesignToolNode, TargetEvent } from '../types';
import {
  getAncestorsIndexes,
  getSelectedElement,
} from '../lib/babel-dom-utils';
import useWindowSize from '../lib/hooks/use-window-size';
import { parseCode, RehypeNode, updateNodeClass } from '../lib/rehype-utils';

const defaultCode = `<article class="w-64 bg-white p-6 rounded-lg shadow-xl">
<p class="mb-4 text-sm uppercase text-gray-500">Total</p>
<h1 class="text-4xl text-gray-800 font-bold leading-tight">77%</h1>
<p class="mb-2 text-sm text-teal-400">+13%</p>

<div class="relative">
  <div class="absolute w-full h-1 bg-gray-200"></div>
  <div class="absolute t-0 w-3/4 h-1 bg-pink-500"></div>
</div>
</article>`;

const LivePage = () => {
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const [code, setCode] = React.useState(defaultCode);
  const [ancestorIndexes, setAncestorIndexes] = React.useState<number[]>();

  const highlightElement = React.useRef<HTMLDivElement>();

  // Top level preview element
  const previewElement =
    typeof window === 'undefined' ? null : document.getElementById('preview');

  // Convert code to AST
  const rootRehypeNode = parseCode(code);
  const nodes = addSelected(rootRehypeNode.children, ancestorIndexes);

  // console.log(rootRehypeNode);
  // console.log(ancestorIndexes);
  console.log(nodes);

  React.useEffect(() => {
    changeHighlightElement(
      previewElement,
      highlightElement.current,
      ancestorIndexes,
    );
  }, [rootRehypeNode]);

  useWindowSize(() => {
    changeHighlightElement(
      previewElement,
      highlightElement.current,
      ancestorIndexes,
    );
  });

  // TODO: Type events
  const handleDesignToolsSubmit = (events) => {
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
          id="preview"
          className="preview flex flex-col items-center justify-center bg-gray-100"
          onClick={(event: TargetEvent) => {
            // Stop <a> links from navigating away
            event.preventDefault();

            const { target, currentTarget } = event;
            const indexes = getAncestorsIndexes(target, currentTarget);
            setAncestorIndexes(indexes);

            // Set selected nodes for DesignToolsApp
            setSelectedNodes([event._targetInst]);
          }}
        >
          <RehypeComponent children={rootRehypeNode.children} />
        </div>

        <div
          className="editor border-t-4"
          style={{
            // Doesn't shrink properly without this
            // https://github.com/suren-atoyan/monaco-react/issues/27
            overflow: 'hidden',
          }}
        >
          <ControlledEditor
            language="html"
            // theme="dark"
            value={code}
            options={{
              minimap: {
                enabled: false,
              },
            }}
            onChange={(event, value) => {
              // console.log(event, value);
              setCode(value);
            }}
          />
        </div>

        <DesignToolsApp
          // TODO: Reconsider the type of selectedNodes, currently it is a [_targetInst], a React specific data structure. Perhaps a simple AST will suffice
          selectedNodes={selectedNodes}
          nodes={nodes}
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

function updateHighlightElement(element, { top, left, width, height }) {
  if (element) {
    // Had to go vanilla JS, tried my hardest with useState and useRef, but it either caused infinite loop or didn't work.
    element.style.outline = `1px solid cyan`;
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.pointerEvents = `none`;
  }
}

const changeHighlightElement = (
  previewElement: HTMLElement,
  highlightElement: HTMLElement,
  ancestorIndexes = [],
) => {
  if (ancestorIndexes.length === 0) {
    return null;
  }

  const element = getSelectedElement(previewElement, ancestorIndexes);

  if (element) {
    const { top, left, width, height } = element.getBoundingClientRect();

    updateHighlightElement(highlightElement, {
      top,
      left,
      width,
      height,
    });
  }
};

/**
 * Add isSelected flag to selected node
 * @param nodes
 * @param ancestorIndexes
 */
function addSelected(
  nodes: RehypeNode[],
  ancestorIndexes: number[] = [],
): DesignToolNode[] {
  if (ancestorIndexes.length === 0) {
    return nodes;
  }

  // Recursively find selected node
  const getNode = (children, level = 0) => {
    const isLast = ancestorIndexes.length === level + 1;
    const index = ancestorIndexes[level];
    const node = children.filter((child) => child.type === 'element')[index];

    if (isLast) {
      return node;
    }

    return getNode(node.children, level + 1);
  };

  const selectedNode = getNode(nodes);
  selectedNode.isSelected = true;

  return nodes;
}

export default LivePage;
