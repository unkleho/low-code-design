import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as types from '@babel/types';

import prettier from '../prettier';

// HIGHLY experimental code to investigate babel jsx

const createElement = ({ code, elementType, lineNumber, columnNumber }) => {
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  // console.log(ast);

  traverse(ast, {
    enter(path) {
      if (
        path.isJSXElement() &&
        path.node.loc?.start.line === lineNumber &&
        path.node.loc?.start.column === columnNumber
      ) {
        // console.log(path.node.children);

        path.node.children.push(
          types.jsxElement(
            types.jsxOpeningElement(types.jsxIdentifier(elementType), []),
            types.jsxClosingElement(types.jsxIdentifier(elementType)),
            []
          )
        );
      }
    },
  });

  const newCode = generate(ast).code;
  const prettierCode = prettier.format(newCode)

  return prettierCode;
};

export default createElement;
