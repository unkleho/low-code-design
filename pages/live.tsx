import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { parse } from '@babel/parser';
// import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';

import DesignToolsApp from '../components/DesignToolsApp';
import { DesignToolsProvider } from '../lib/contexts/design-tools-context';
import { TargetEvent } from '../types';
import {
  getAncestorsIndexes,
  getRootNode,
  getSelectedElement,
  getSelectedNode,
} from '../lib/babel-dom-utils';
import useMutationObserver from '../lib/hooks/use-mutation-observer';
import useWindowSize from '../lib/hooks/use-window-size';

const defaultCode = `<div id="hello"><strong className="uppercase">Hello World!</strong><p>Some text</p>
  <div><p>Deep text</p></div>
  </div>`;

const LivePage = () => {
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const [code, setCode] = React.useState(defaultCode);

  const [ancestorIndexes, setAncestorIndexes] = React.useState<number[]>();

  const highlightElement = React.useRef<HTMLDivElement>();

  // Top level element to observe using MutationObserver
  const observeElement =
    typeof window === 'undefined' ? null : document.getElementById('preview');

  // TODO: May not need observer anymore, but this runs after code is updated and LivePreview remounts
  useMutationObserver(
    observeElement,
    { attributes: true, childList: true, subtree: true },
    () => {
      const element = getSelectedElement(observeElement, ancestorIndexes);
      const { top, left, width, height } = element.getBoundingClientRect();

      updateHighlightElement(highlightElement.current, {
        top,
        left,
        width,
        height,
      });

      // Had to go vanilla JS, tried my hardest with useState and useRef, but it either caused infinite loop or didn't work.
      // highlightElement.current.style.outline = `1px solid cyan`;
      // highlightElement.current.style.top = `${top}px`;
      // highlightElement.current.style.left = `${left}px`;
      // highlightElement.current.style.width = `${width}px`;
      // highlightElement.current.style.height = `${height}px`;
      // highlightElement.current.style.pointerEvents = `none`;
    },
  );

  useWindowSize(() => {
    const element = getSelectedElement(observeElement, ancestorIndexes);
    const { top, left, width, height } = element.getBoundingClientRect();

    updateHighlightElement(highlightElement.current, {
      top,
      left,
      width,
      height,
    });

    // Had to go vanilla JS, tried my hardest with useState and useRef, but it either caused infinite loop or didn't work.
    // highlightElement.current.style.outline = `1px solid cyan`;
    // highlightElement.current.style.top = `${top}px`;
    // highlightElement.current.style.left = `${left}px`;
    // highlightElement.current.style.width = `${width}px`;
    // highlightElement.current.style.height = `${height}px`;
    // highlightElement.current.style.pointerEvents = `none`;
  });

  // TODO: Type events
  const handleDesignToolsSubmit = (events) => {
    const event = events[0]; // Allow multiple node changes in future
    const { node, type, className } = event;

    // Change node className
    if (node && type === 'UPDATE_FILE_CLASS_NAME') {
      // Parse code and turn it into an AST
      const ast = parse(code, {
        plugins: ['jsx'],
      });

      // Find root node
      const rootNode = getRootNode(ast);

      // Get selected node
      const selected = getSelectedNode(rootNode, ancestorIndexes);

      // Get classNameAttribute
      const attributes = selected.openingElement.attributes;
      const classNameAttribute = attributes.find((attribute) => {
        return attribute.name.name === 'className';
      });

      // Update className or add it to JSX element
      if (classNameAttribute) {
        classNameAttribute.value.value = className;
      } else {
        attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier('className'),
            t.stringLiteral(className),
          ),
        );
      }

      // Convert AST to code
      const newCode = generate(ast).code;
      setCode(newCode);
    }
  };

  return (
    <DesignToolsProvider>
      <div className="flex">
        <div className="fixed" ref={highlightElement}></div>
        <div className="flex flex-1 justify-center items-center flex-col h-screen">
          <LiveProvider
            code={code}
            transformCode={(newCode) => {
              return newCode;
            }}
          >
            <LiveError />

            <LivePreview
              id="preview"
              className="flex-1"
              onClick={(event: TargetEvent) => {
                // Stop <a> links from navigating away
                event.preventDefault();

                const { target, currentTarget } = event;
                const indexes = getAncestorsIndexes(target, currentTarget);
                setAncestorIndexes(indexes);

                // Get dimensions of selected node
                // const {
                //   width,
                //   height,
                //   top,
                //   left,
                // } = target.getBoundingClientRect();

                // Set selected nodes for DesignToolsApp
                setSelectedNodes([event._targetInst]);
              }}
            />

            <LiveEditor className="flex-1" />
          </LiveProvider>
        </div>

        <DesignToolsApp
          selectedNodes={selectedNodes}
          className={['max-h-full h-screen overflow-auto'].join(' ')}
          onNodeChange={handleDesignToolsSubmit}
        />
      </div>
    </DesignToolsProvider>
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
