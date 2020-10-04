import createElement from '../create-element';

describe('Create Element', () => {
  it('should append div inside another div', () => {
    const result = createElement({
      lineNumber: 4,
      columnNumber: 9,
      elementType: 'div',
      code: `import React from 'react';

const Example = () => {
  return <div></div>;
};

export default Example;`,
    });

    expect(result).toEqual(`import React from 'react';

const Example = () => {
  return <div><div></div></div>;
};

export default Example;`);
  });

  it('should append p after another p', () => {
    const result = createElement({
      lineNumber: 4,
      columnNumber: 9,
      elementType: 'p',
      code: `import React from 'react';

const Example = () => {
  return <div><p>First</p></div>;
};

export default Example;`,
    });

    expect(result).toEqual(`import React from 'react';

const Example = () => {
  return <div><p>First</p><p></p></div>;
};

export default Example;`);
  });
});
