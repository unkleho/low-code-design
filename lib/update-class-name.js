// TODO:
// - Update className={'my-class'}
// - Update className={`my-class`}
// - Update className={['my-class'].join(' ')}
const updateClassName = ({ text, lineNumber, columnNumber, className }) => {
  return updateAttrValue({
    text,
    lineNumber,
    columnNumber,
    attrName: 'className',
    attrValue: className,
  });
};

const updateAttrValue = ({
  text,
  lineNumber,
  columnNumber,
  attrName,
  attrValue,
}) => {
  const lines = text.split('\n');
  const line = lines[lineNumber - 1];

  // Extract anything before columnNumber
  const beforeTrimmedLine = line.substring(0, columnNumber);
  // Build trimmed line array
  const trimmedLineArray = line.substring(columnNumber).split('>');
  // Extract trimmed line before first '>'
  const trimmedLine = trimmedLineArray[0];
  // Rebuild trimmed lined after first '>'
  const afterTrimmedLine = '>' + trimmedLineArray.slice(1).join('>');

  let newTrimmedLine;
  let newLine = line;

  // Check if className is a string
  if (trimmedLine.match(`${attrName}="`)) {
    // console.log(beforeTrimmedLine);
    // console.log(trimmedLine);
    // console.log(afterTrimmedLine);

    const regex = new RegExp(`${attrName}="([^']*)"`);

    // Replace old className with new one
    newTrimmedLine = trimmedLine.replace(
      // /className="([^']*)"/,
      regex,
      `${attrName}="${attrValue}"`
    );

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
