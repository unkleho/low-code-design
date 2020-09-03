import fs from 'fs';
// import path from 'path';
// import { parse } from '@babel/parser';
// import generate from '@babel/generator';
// import traverse from '@babel/traverse';

import updateClassName from '../../lib/update-class-name';

export default ({ method, body }, res) => {
  if (method !== 'POST') {
    return null;
  }

  const { lineNumber, columnNumber, className, fileName } = body;

  const file = fs.readFileSync(fileName, 'utf8');

  const newFile = updateClassName({
    text: file,
    className,
    lineNumber: parseInt(lineNumber),
    columnNumber: parseInt(columnNumber),
  });

  fs.writeFileSync(fileName, newFile);

  res.statusCode = 200;
  res.json({ code: JSON.stringify(newFile) });
};

// const getFullPathname = (fileName) => {
//   return path.join(process.cwd(), fileName);
// };

// Not using this because Babel generate doesn't keep original formatting
// const parseAst = (file, className, lineNumber) => {
//   let ast = parse(file, {
//     sourceType: 'module',
//     plugins: ['jsx'],
//   });

//   traverse(ast, {
//     enter(path) {
//       if (
//         path.node.type === 'JSXAttribute' &&
//         path.node.name.name === 'className' &&
//         path.node.loc.start.line === parseInt(lineNumber)
//       ) {
//         // console.log(path.node);
//         path.node.value.value = className;
//       }
//     },
//   });

//   const output = generate(
//     ast,
//     {
//       // retainLines: true,
//       /* options */
//     }
//     // file
//   );

//   return output;
// };
