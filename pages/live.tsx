import React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import generate from "@babel/generator";

import DesignToolsApp from "../components/DesignToolsApp";
import { DesignToolsProvider } from "../lib/contexts/design-tools-context";
import { TargetEvent } from "../types";

const defaultCode = `<div id="hello"><strong className="uppercase">Hello World!</strong><p>Some text</p>
  <div><p>Deep text</p></div>
  </div>`;

const LivePage = () => {
  const [selectedNodes, setSelectedNodes] = React.useState([]);
  const [code, setCode] = React.useState(defaultCode);
  const [highlightStyle, setHighlightStyle] = React.useState<
    React.CSSProperties
  >();
  const [selectedIndex, setSelectedIndex] = React.useState<number>();

  const handleDesignToolsSubmit = (events) => {
    const event = events[0]; // Allow multiple node changes in future
    const { node, type, className } = event;

    // Change node className
    if (node && type === "UPDATE_FILE_CLASS_NAME") {
      // Parse code and turn it into an AST
      const ast = parse(code, {
        plugins: ["jsx"],
      });

      // Find root node
      const rootNode = getRootNode(ast);

      // Get selected node
      // TODO: Only one level deep, enable deeper node levels
      const selected = rootNode.children[selectedIndex];

      // Get classNameAttribute
      const attributes = selected.openingElement.attributes;
      const classNameAttribute = attributes.find((attribute) => {
        return attribute.name.name === "className";
      });

      // Update className or add it to JSX element
      if (classNameAttribute) {
        classNameAttribute.value.value = className;
      } else {
        attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier("className"),
            t.stringLiteral(className)
          )
        );
      }

      // Convert AST to code
      const newCode = generate(ast).code;
      setCode(newCode);
    }
  };

  return (
    <DesignToolsProvider>
      <div>
        <div className="fixed" style={highlightStyle}></div>
        <div className="flex justify-center items-center flex-col">
          <LiveProvider
            code={code}
            transformCode={(newCode) => {
              return newCode;
            }}
          >
            <LiveEditor />
            <LiveError />

            <div
              onClick={(event: TargetEvent) => {
                // Stop <a> links from navigating away
                event.preventDefault();

                const { target } = event;

                // Get dimensions of selected node
                const {
                  width,
                  height,
                  top,
                  left,
                } = target.getBoundingClientRect();

                // Transfer dimensions to highlight overlay div
                // TODO: Update this whenever code or screen changes
                setHighlightStyle({
                  outline: "1px solid cyan",
                  width,
                  height,
                  top,
                  left,
                });

                // Get and set index
                // https://stackoverflow.com/questions/13656921/fastest-way-to-find-the-index-of-a-child-node-in-parent
                const index = [].indexOf.call(
                  target.parentNode.children,
                  target
                );
                setSelectedIndex(index);

                // Set selected nodes for DesignToolsApp
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

const getRootNode = (ast: t.File): t.JSXElement => {
  let rootNode;

  traverse(ast, {
    JSXElement: (path) => {
      // If root node
      if (path.key === "expression") {
        rootNode = path.node;
      }
    },
  });

  return rootNode;
};

export default LivePage;
