// import { parse } from "@babel/parser";
import traverse from '@babel/traverse';
import * as t from '@babel/types';
// import generate from "@babel/generator";

export const getRootNode = (ast: t.File): t.JSXElement => {
  let rootNode;

  traverse(ast, {
    JSXElement: (path) => {
      // If root node
      if (path.key === 'expression') {
        rootNode = path.node;
      }
    },
  });

  return rootNode;
};

/**
 * Use indexes to drill down rootNode's children and descendents to get selected node
 * @param rootNode Top level node in AST
 * @param indexes Array of numbers indicating path to selected node
 */
export function getSelectedNode(
  rootNode: t.JSXElement,
  indexes: number[] = [],
): t.JSXElement {
  // Disregard first index for now. It should always be 0 due to JSX constraints
  const newIndexes = indexes.slice(1);

  // TODO: Test for fragments
  const selectedNode = newIndexes.reduce((acc, index) => {
    // Filter out children that are not JSXElements, eg. JSXText (line breaks show up as text!)
    const children = acc.children.filter(
      (child) => child.type === 'JSXElement',
    );

    return children[index];
  }, rootNode);

  return selectedNode as t.JSXElement;
}

/**
 * Recursive function to get index array indicating path to element
 * TODO: Move to dom-utils?
 * @param element Element to start
 * @param rootElement Root element to stop traversal
 * @param acc Accumulator, for recursive trickiness only!
 */
export function getPathIndexes(
  element: HTMLElement,
  rootElement: HTMLElement,
  acc: number[] = [],
): number[] {
  // If document (top level)
  if (!element.parentElement) {
    return [];
  }

  const index = [].indexOf.call(element.parentElement.children, element);
  const result = [index, ...acc];

  if (element.parentElement !== rootElement) {
    return getPathIndexes(element.parentElement, rootElement, result);
  }

  return result;
}

export function getSelectedElement(
  rootElement: HTMLElement,
  pathIndexes: number[] = [],
) {
  const result = pathIndexes.reduce((prev, index) => {
    return prev.children[index];
  }, rootElement);

  return result;
}
