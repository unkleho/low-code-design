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

export default Example;`);
  });
});
