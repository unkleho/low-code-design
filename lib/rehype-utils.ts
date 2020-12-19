import rehype from 'rehype';

export function updateNodeClass(
  code: string,
  indexes: number[],
  className: string,
) {
  const ast = parseCode(code);
  const selectedNode = getSelectedNode(ast, indexes);

  if (className) {
    selectedNode.properties.className = className;
  } else if (!className && selectedNode.properties.className) {
    delete selectedNode.properties.className;
  }

  // selectedNode.properties.className = [
  //   ...(selectedNode.properties.className || []),
  //   className,
  // ];

  const newCode = rehype().stringify(ast);

  return newCode;
}

// export function removeNodeClass(code, indexes, className) {
//   const ast = parseCode(code);
//   const selectedNode = getSelectedNode(ast, indexes);

//   selectedNode.properties.className = selectedNode.properties.className.filter(
//     (c) => {
//       return c !== className;
//     },
//   );

//   if (selectedNode.properties.className.length === 0) {
//     delete selectedNode.properties.className;
//   }

//   const newCode = rehype().stringify(ast);

//   return newCode;
// }

export function parseCode(code: string) {
  const ast = rehype()
    .data('settings', {
      fragment: true,
    })
    .parse(code);

  return ast;
}

function getSelectedNode(rootNode, indexes) {
  const selectedNode = indexes.reduce((acc, index) => {
    const children = acc.children.filter((child) => child.type === 'element');

    return children[index];
  }, rootNode);

  return selectedNode;
}
