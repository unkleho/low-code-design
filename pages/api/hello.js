// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import generate from '@babel/generator';
import traverse from '@babel/traverse';

export default ({ query }, res) => {
  // const lineNumber = 4;
  // const newClassNameValue = 'test-1 test-2 test-3';
  // const pathname =
  //   '/Users/kcheung/Development/unkleho/codesign/components/Example.js';

  const {
    lineNumber = 4,
    className = 'test-1 test-2 test-4',
    pathname = '/Users/kcheung/Development/unkleho/codesign/components/Example.js',
  } = query;

  console.log(query);

  // const pathname = path.join(process.cwd(), '/components/Example.js');
  // console.log(pathname);
  let file = fs.readFileSync(pathname, 'utf8');
  // console.log(file);

  let ast = parse(file, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  // console.log(
  //   ast.program.body[1].declarations[0].init.body.body[0].argument
  //     .openingElement.attributes[0].value.value
  // );

  // ast.program.body[0].declarations[0].init.body.body[0].argument.openingElement.attributes[0].value.value =
  //   'test-1 test-2 test-3';

  console.log('-> traverse');
  traverse(ast, {
    enter(path) {
      if (
        path.node.type === 'JSXAttribute' &&
        path.node.name.name === 'className' &&
        path.node.loc.start.line === parseInt(lineNumber)
      ) {
        console.log(path.node);
        path.node.value.value = className;
      }
    },
  });

  // ast.program.body[1].declarations[0].init.body.body[0].argument.openingElement.attributes[0].value.value =
  //   'test-1 test-2 test-3';

  const output = generate(
    ast,
    {
      /* options */
    }
    // file
  );

  // console.log(
  //   ast.program.body[0].declarations[0].init.body.body[0].argument
  //     .openingElement.attributes[0].value.value
  // );

  console.log(output.code);

  fs.writeFileSync(pathname, output.code);
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
