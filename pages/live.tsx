import React from 'react';
// import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
// import { parse } from '@babel/parser';
// import * as t from '@babel/types';
// import generate from '@babel/generator';

import DesignToolsApp from '../components/DesignToolsApp';
import { DesignToolsProvider } from '../lib/contexts/design-tools-context';
import { TargetEvent } from '../types';
import {
  getAncestorsIndexes,
  // getRootNode,
  getSelectedElement,
  // getSelectedNode,
} from '../lib/babel-dom-utils';
// import useMutationObserver from '../lib/hooks/use-mutation-observer';
import useWindowSize from '../lib/hooks/use-window-size';
import { ControlledEditor } from '@monaco-editor/react';
import { parseCode, updateNodeClass } from '../lib/rehype-utils';

const defaultCode = `<div id="hello"><strong class="uppercase">Hello World!</strong><p>Some text</p>
  <div><p>Deep text</p></div>
  </div>`;

const RehypeComponent = ({ tagName, properties, children }) => {
  return React.createElement(
    tagName,
    {
      ...properties,
      ...(properties.className
        ? { className: properties.className.join(' ') }
        : {}),
    },
    ...children.map((child, i) => {
      // TODO: Deal with fragments and other children types!
      if (child.type === 'text') {
        return child.value;
      }

      if (child.type === 'element') {
        return (
          <RehypeComponent
            tagName={child.tagName}
            properties={child.properties}
            children={child.children}
            key={i}
          />
        );
      }
    }),
  );
};

const LivePage = () => {
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const [code, setCode] = React.useState(defaultCode);

  const [ancestorIndexes, setAncestorIndexes] = React.useState<number[]>();

  const highlightElement = React.useRef<HTMLDivElement>();

  // Top level preview element
  const previewElement =
    typeof window === 'undefined' ? null : document.getElementById('preview');

  const ast = parseCode(code);

  React.useEffect(() => {
    const element = getSelectedElement(previewElement, ancestorIndexes);
    const { top, left, width, height } = element.getBoundingClientRect();

    updateHighlightElement(highlightElement.current, {
      top,
      left,
      width,
      height,
    });
  }, [ast]);
  // console.log(ast);

  useWindowSize(() => {
    const element = getSelectedElement(previewElement, ancestorIndexes);
    const { top, left, width, height } = element.getBoundingClientRect();

    updateHighlightElement(highlightElement.current, {
      top,
      left,
      width,
      height,
    });
  });

  // TODO: Type events
  const handleDesignToolsSubmit = (events) => {
    const event = events[0]; // Allow multiple node changes in future
    const { node, type, className } = event;

    // Change node className
    if (node && type === 'UPDATE_FILE_CLASS_NAME') {
      // Parse code and turn it into an AST
      const newCode = updateNodeClass(code, ancestorIndexes, className);

      // const ast = parse(code, {
      //   plugins: ['jsx'],
      // });

      // // Find root node
      // const rootNode = getRootNode(ast);

      // // Get selected node
      // const selected = getSelectedNode(rootNode, ancestorIndexes);

      // // Get classNameAttribute
      // const attributes = selected.openingElement.attributes;
      // const classNameAttribute = attributes.find((attribute) => {
      //   return attribute.name.name === 'className';
      // });

      // // Update className or add it to JSX element
      // if (classNameAttribute) {
      //   classNameAttribute.value.value = className;
      // } else {
      //   attributes.push(
      //     t.jsxAttribute(
      //       t.jsxIdentifier('className'),
      //       t.stringLiteral(className),
      //     ),
      //   );
      // }

      // // Convert AST to code
      // const newCode = generate(ast).code;
      setCode(newCode);
    }
  };

  // console.log(ancestorIndexes);

  return (
    <DesignToolsProvider>
      <div className="flex">
        <div className="fixed" ref={highlightElement}></div>
        <div className="flex flex-1 justify-center items-center flex-col h-screen">
          {/* <div> */}
          <div
            // dangerouslySetInnerHTML={{
            //   __html: code,
            // }}
            id="preview"
            className="flex-1 w-full"
            onClick={(event: TargetEvent) => {
              // Stop <a> links from navigating away
              event.preventDefault();

              const { target, currentTarget } = event;
              const element = target;
              const indexes = getAncestorsIndexes(target, currentTarget);
              setAncestorIndexes(indexes);

              // console.log({ target, currentTarget });
              // console.log(event._targetInst);

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
          >
            {ast.children.map((c, i) => {
              return (
                <RehypeComponent
                  tagName={c.tagName}
                  properties={c.properties}
                  children={c.children}
                  key={i}
                />
              );
            })}
          </div>

          <div className="flex-1 w-full">
            <ControlledEditor
              // height="50vh"
              language="html"
              theme="dark"
              value={code}
              options={{
                minimap: {
                  enabled: false,
                },
              }}
              onChange={(event, value) => {
                console.log(event, value);
                setCode(value);
              }}
            />
          </div>
          {/* </div> */}

          {/* <LiveProvider
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
          </LiveProvider> */}
        </div>

        <DesignToolsApp
          // TODO: Reconsider the type of selectedNodes, currently it is a [_targetIinst], a React specific data structure. Perhaps a simple AST will suffice
          selectedNodes={selectedNodes}
          className={['max-h-full h-screen overflow-auto'].join(' ')}
          onNodeChange={handleDesignToolsSubmit}
        />
      </div>
    </DesignToolsProvider>
  );
};

class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

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
