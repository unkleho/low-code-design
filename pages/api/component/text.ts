import fs from 'fs';
import updateElementText from '../../../lib/file/update-element-text';

export default ({ method, body }, res) => {
  if (method !== 'POST') {
    return null;
  }

  const { text, fileName, lineNumber, columnNumber } = body;

  const code = fs.readFileSync(fileName, 'utf8');

  const newCode = updateElementText({
    lineNumber: parseInt(lineNumber),
    columnNumber: parseInt(columnNumber) - 1,
    text,
    code,
  });

  if (code !== newCode) {
    console.log('Update Text', text, code, newCode, lineNumber, columnNumber);
    fs.writeFileSync(fileName, newCode);
  }

  res.statusCode = 200;
  res.json({ code: JSON.stringify(newCode) });
};
