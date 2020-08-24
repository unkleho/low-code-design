import fs from 'fs';
import path from 'path';
// import { parse } from '@babel/parser';
// import generate from '@babel/generator';
// import traverse from '@babel/traverse';

import updateClassName from '../../lib/update-class-name';

export default ({ query }, res) => {
  const { lineNumber, columnNumber, className, pathname } = query;

  const file = fs.readFileSync(pathname, 'utf8');

  // let ast = parse(file, {
  //   sourceType: 'module',
  //   plugins: ['jsx'],
  // });

  // traverse(ast, {
  //   enter(path) {
  //     if (
  //       path.node.type === 'JSXAttribute' &&
  //       path.node.name.name === 'className' &&
  //       path.node.loc.start.line === parseInt(lineNumber)
  //     ) {
  //       // console.log(path.node);
  //       path.node.value.value = className;
  //     }
  //   },
  // });

  // const output = generate(
  //   ast,
  //   {
  //     // retainLines: true,
  //     /* options */
  //   }
  //   // file
  // );

  const newFile = updateClassName({
    text: file,
    className,
    lineNumber: parseInt(lineNumber),
    columnNumber: parseInt(columnNumber),
  });

  // fs.writeFileSync(pathname, output.code);
  fs.writeFileSync(pathname, newFile);

  // fs.writeFileSync(
  //   getFullPathname('/components/Example.ast.json'),
  //   JSON.stringify(ast)
  // );

  res.statusCode = 200;
  res.json({ code: JSON.stringify(newFile) });
};

const getFullPathname = (pathname) => {
  return path.join(process.cwd(), pathname);
};
