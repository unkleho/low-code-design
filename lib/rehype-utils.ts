import rehype from 'rehype';

/**
 * Custom Rehype Parser types as rehype's are lacking
 */
export type RehypeNode = {
  type: 'element' | 'text';
  tagName: string;
  properties?: {
    className?: string[];
  };
  children?: RehypeNode[];
  value?: string;
};

// Used in RehypeComponent, but getting funny errors if used in parseCode and getSelectedNode
export type RehypeRootNode = {
  type: 'root';
  children?: RehypeNode[];
};

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

  // if (selectedNode.type !== 'root') {
  if (selectedNode.properties && className) {
    selectedNode.properties.className = className.split(' ');
  } else if (!className && selectedNode.properties.className) {
    delete selectedNode.properties.className;
  }
  // }

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

function getSelectedNode(rootNode: RehypeNode, indexes: number[]): RehypeNode {
  const selectedNode = indexes.reduce((acc, index) => {
    const children = acc.children.filter((child) => child.type === 'element');

    return children[index];
  }, rootNode);

  return selectedNode;
}
