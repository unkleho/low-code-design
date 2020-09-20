import fs from 'fs';
import createElement from '../../../lib/file/create-element';

export default ({ method, body }, res) => {
  if (method !== 'POST') {
    return null;
  }

  const { elementType, fileName, lineNumber, columnNumber } = body;

  const code = fs.readFileSync(fileName, 'utf8');

  const newCode = createElement({
    elementType,
    code,
    lineNumber: parseInt(lineNumber),
    columnNumber: parseInt(columnNumber) - 1,
  });

  if (code !== newCode) {
    console.log(
      'Create Element',
      elementType,
      code,
      newCode,
      lineNumber,
      columnNumber
    );
    fs.writeFileSync(fileName, newCode);
  }

  res.statusCode = 200;
  res.json({ code: JSON.stringify(newCode) });
};
