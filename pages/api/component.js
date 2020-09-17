import fs from 'fs';
import updateElementText from '../../lib/file/update-element-text';
// import path from 'path';
// import { parse } from '@babel/parser';
// import generate from '@babel/generator';
// import traverse from '@babel/traverse';

import updateClassName from '../../lib/update-class-name';

export default ({ method, body }, res) => {
  if (method !== 'POST') {
    return null;
  }

  const { lineNumber, columnNumber, className, text, fileName } = body;

  const file = fs.readFileSync(fileName, 'utf8');

  let newFile = updateClassName({
    text: file,
    className,
    lineNumber: parseInt(lineNumber),
    columnNumber: parseInt(columnNumber),
  });

  if (text) {
    // console.log(lineNumber, columnNumber, text, newFile);

    newFile = updateElementText({
      lineNumber: parseInt(lineNumber),
      columnNumber: parseInt(columnNumber) - 1,
      text,
      code: newFile,
    });
  }

  if (file !== newFile) {
    fs.writeFileSync(fileName, newFile);
  }

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
