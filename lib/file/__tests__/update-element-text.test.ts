import updateElementText from '../update-element-text';

describe('Element Text', () => {
  it('should update text inside p', () => {
    const result = updateElementText({
      lineNumber: 4,
      columnNumber: 9,
      text: 'Goodbye',
      code: `import React from 'react';

const Example = () => {
  return <p>Hello</p>;
};

export default Example;`,
    });

    expect(result).toEqual(`import React from 'react';

const Example = () => {
  return <p>Goodbye</p>;
};

export default Example;
`);
  });

  it('should update li text inside ul', () => {
    const result = updateElementText({
      lineNumber: 6,
      columnNumber: 6,
      text: 'Still first',
      code: `import React from 'react';

const Example = () => {
  return (
    <ul>
      <li>First</li>
      <li>Second</li>
    </ul>
  );
};

export default Example;
`,
    });

    expect(result).toEqual(`import React from 'react';

const Example = () => {
  return (
    <ul>
      <li>Still first</li>
      <li>Second</li>
    </ul>
  );
};

export default Example;
`);
  });
});
