import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as types from '@babel/types';

// HIGHLY experimental code to investigate babel jsx

const appendElements = ({ text, lineNumber, element }) => {
  const ast = parse(text, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  // console.log(ast);

  traverse(ast, {
    enter(path) {
      if (path.isJSXElement() && path.node.loc?.start.line === lineNumber) {
        // console.log(path.node);

        path.node.children.push(
          types.jsxElement(
            types.jsxOpeningElement(types.jsxIdentifier(element), []),
            types.jsxClosingElement(types.jsxIdentifier(element)),
            []
          )
        );
      }
    },
  });

  return generate(ast).code;
};

export default appendElements;
