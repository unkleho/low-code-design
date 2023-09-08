import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

import prettier from '../prettier';

const updateClassNameInFile = ({
  lineNumber,
  columnNumber,
  className,
  code,
}) => {
  if (!className) {
    return code;
  }

  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  traverse(ast, {
    enter(path) {
      const nodeLineNumber = path.node.loc?.start.line;
      const nodeColumnNumber = path.node.loc?.start.column;

      if (
        path.isJSXElement() &&
        nodeLineNumber === lineNumber &&
        nodeColumnNumber === columnNumber
      ) {
        const attributes = path.node.openingElement.attributes;

        const classNameAttribute = attributes.find((attribute) => {
          // @ts-ignore
          return attribute.name.name === 'className';
        });

        if (classNameAttribute) {
          // @ts-ignore
          classNameAttribute.value.value = className;
        } else {
          attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('className'),
              t.stringLiteral(className),
            ),
          );
        }

        // attributes.forEach((attribute, i) => {
        //   if (attribute.name.name === 'className') {
        //     attribute.value.value = className;
        //   }
        // })
      }
    },
  });

  const newCode = generate(ast).code;
  const prettierCode = prettier.format(newCode);

  return prettierCode;
};

export default updateClassNameInFile;
