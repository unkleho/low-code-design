// TODO:
// - Update className={'my-class'}
// - Update className={`my-class`}
// - Update className={['my-class'].join(' ')}
const updateClassName = ({ code, lineNumber, columnNumber, className }) => {
  return updateAttrValue({
    code,
    lineNumber,
    columnNumber,
    attrName: 'className',
    attrValue: className,
  });
};

const updateAttrValue = ({
  code,
  lineNumber,
  columnNumber,
  attrName,
  attrValue,
}) => {
  const lines = code.split('\n');
  const line = lines[lineNumber - 1];

  // Extract anything before columnNumber
  const beforeTrimmedLine = line.substring(0, columnNumber);
  // Build trimmed line array
  const trimmedLineArray = line.substring(columnNumber).split('>');
  // Extract trimmed line before first '>'
  const trimmedLine = trimmedLineArray[0];
  // Rebuild trimmed lined after first '>'
  const afterTrimmedLine = '>' + trimmedLineArray.slice(1).join('>');

  let newLine = line;

  // console.log(beforeTrimmedLine);
  // console.log(trimmedLine);
  // console.log(afterTrimmedLine);

  // TODO: Match className={`p-2`} and className={['p-2'].join(' ')}
  if (trimmedLine.match(`${attrName}="`)) {
    // Check if className is a string

    // Replace old className with new one
    const regex = new RegExp(`${attrName}="([^']*)"`);
    const newTrimmedLine = trimmedLine.replace(
      regex,
      `${attrName}="${attrValue}"`
    );

    // Reassemble line
    newLine = beforeTrimmedLine + newTrimmedLine + afterTrimmedLine;
  } else {
    // If no `attrName` found, insert attribute into element

    const newTrimmedLine = `${trimmedLine} className="${attrValue}"`;

    // Reassemble line
    newLine = beforeTrimmedLine + newTrimmedLine + afterTrimmedLine;
  }

  return lines
    .map((line, i) => {
      if (i + 1 === lineNumber) {
        return newLine;
      }

      return line;
    })
    .join('\n');
};

export default updateClassName;
