import rehype from 'rehype';
import { RehypeNode, DesignToolNode } from '../types';
import { Node } from 'unist';

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

  // @ts-ignore
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

  if (text && selectedNode.children?.length) {
    selectedNode.children[0].value = text;
  }

  const newCode = rehype().stringify(ast as Node);

  return newCode;
}

export function addNode(code: string, indexes: number[], tagName: string) {
  const ast = parseCode(code);
  const selectedNode = getSelectedNode(ast, indexes);

  if (selectedNode?.children) {
    selectedNode.children.push({
      type: 'element',
      tagName,
      // TODO: Change default text value?
      children: [{ type: 'text', value: 'Text', tagName: null }],
    });
  }

  console.log('addNode', ast, selectedNode);
  const newCode = rehype().stringify(ast as Node);

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
    // console.log(rootNode, acc, indexes);

    const children = acc.children.filter((child) => child.type === 'element');

    return children[index];
  }, rootNode);

  return selectedNode;
}

/**
 * Add isSelected flag to selected node
 * @param nodes
 * @param pathIndexes
 */
export function addSelected(
  nodes: RehypeNode[],
  pathIndexes: number[] = [],
): DesignToolNode[] {
  if (pathIndexes.length === 0) {
    return nodes;
  }

  // Recursively find selected node
  const getNode = (children = [], level = 0) => {
    const isLast = pathIndexes.length === level + 1;
    const index = pathIndexes[level];
    const node =
      children.filter((child) => child.type === 'element')[index] || [];

    if (isLast) {
      return node;
    }

    return getNode(node.children, level + 1);
  };

  const selectedNode = getNode(nodes);
  selectedNode.isSelected = true;

  return nodes;
}
