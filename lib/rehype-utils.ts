import rehype from 'rehype';
import { RehypeNode } from '../types';

/**
 * Update className of a target element within HTML code
 * @param code HTML code
 * @param indexes Index array to target element
 * @param className New className to replace in element
 */
export function updateNodeClass(
  code: string,
  indexes: number[],
  className: string,
): string {
  const ast = parseCode(code);
  const selectedNode = getSelectedNode(ast, indexes);

  if (selectedNode.properties && className) {
    selectedNode.properties.className = className.split(' ');
  } else if (!className && selectedNode.properties?.className) {
    delete selectedNode.properties.className;
  }

  const newCode = rehype().stringify(ast);

  return newCode;
}

/**
 * Update text value of a target element within HTML code
 * @param code HTML code
 * @param indexes Index array to target element
 * @param text New text to replace in element
 */
export function updateNodeText(
  code: string,
  indexes: number[],
  text: string,
): string {
  const ast = parseCode(code);
  const selectedNode = getSelectedNode(ast, indexes);

  selectedNode.children[0].value = text;

  const newCode = rehype().stringify(ast);

  return newCode;
}

export function parseCode(code: string): RehypeNode {
  const ast = rehype()
    .data('settings', {
      fragment: true,
    })
    .parse(code);

  return ast as RehypeNode;
}

export function getSelectedNode(
  rootNode: RehypeNode,
  indexes: number[],
): RehypeNode {
  if (!rootNode) {
    return null;
  }

  const selectedNode = indexes.reduce((acc, index) => {
    console.log(rootNode, acc, indexes);

    const children = acc.children.filter((child) => child.type === 'element');

    return children[index];
  }, rootNode);

  return selectedNode;
}
