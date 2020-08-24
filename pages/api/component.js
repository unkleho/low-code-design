// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import generate from '@babel/generator';
import traverse from '@babel/traverse';

import updateClassName from '../../lib/update-class-name';

export default ({ query }, res) => {
  const {
    lineNumber = 4,
    columnNumber = 10,
    className = 'test-1 test-2 test-4',
    pathname = '/Users/kcheung/Development/unkleho/codesign/components/Example.js',
  } = query;

  // console.log(query);

  const file = fs.readFileSync(pathname, 'utf8');
  // console.log(file);

  let ast = parse(file, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  // console.log('-> traverse');
  traverse(ast, {
    enter(path) {
      if (
        path.node.type === 'JSXAttribute' &&
        path.node.name.name === 'className' &&
        path.node.loc.start.line === parseInt(lineNumber)
      ) {
        // console.log(path.node);
        path.node.value.value = className;
      }
    },
  });

  const output = generate(
    ast,
    {
      // retainLines: true,
      /* options */
    }
    // file
  );

  const output2 = updateClassName({
    text: file,
    className,
    lineNumber: parseInt(lineNumber),
    columnNumber: parseInt(columnNumber),
  });

  // console.log(className, lineNumber, columnNumber);
  // console.log(output2);

  // console.log(output.code);

  // fs.writeFileSync(pathname, output.code);
  fs.writeFileSync(pathname, output2);

  // fs.writeFileSync(
  //   getFullPathname('/components/Example.ast.json'),
  //   JSON.stringify(ast)
  // );

  res.statusCode = 200;
  res.json({ code: JSON.stringify(output.code) });
};

const getFullPathname = (pathname) => {
  return path.join(process.cwd(), pathname);
};
