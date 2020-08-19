// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import generate from '@babel/generator';

export default (req, res) => {
  const pathname = path.join(process.cwd(), '/components/Example.js');
  console.log(pathname);
  let file = fs.readFileSync(pathname, 'utf8');
  console.log(file);

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

  ast.program.body[1].declarations[0].init.body.body[0].argument.openingElement.attributes[0].value.value =
    'test-1 test-2 test-3';

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

  res.statusCode = 200;
  res.json({ name: 'John Doe' });
};
