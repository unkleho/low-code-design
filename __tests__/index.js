import updateClassName from '../lib/update-class-name';
import appendElement from '../lib/append-element';
import updateElementText from '../lib/file/update-element-text';

describe('Update ClassName', () => {
  it('should update small component', () => {
    const result = updateClassName({
      lineNumber: 4,
      columnNumber: 10,
      className: 'lowercase p-4',
      text: `import React from 'react';

const Example = () => {
  return <div className="uppercase p-4">Example Component</div>;
};

export default Example;`,
    });

    expect(result).toEqual(`import React from 'react';

const Example = () => {
  return <div className="lowercase p-4">Example Component</div>;
};

export default Example;`);
  });

  it('should update first className on line', () => {
    const result = updateClassName({
      lineNumber: 4,
      columnNumber: 10,
      className: 'p-6',
      text: `import React from 'react';

const Example = () => {
  return <div className="p-4"><span className="p-2"></span></div>;
};

export default Example;`,
    });

    expect(result).toEqual(`import React from 'react';

const Example = () => {
  return <div className="p-6"><span className="p-2"></span></div>;
};

export default Example;`);
  });

  it('should update second className on line', () => {
    const result = updateClassName({
      lineNumber: 4,
      columnNumber: 31,
      className: 'p-4',
      text: `import React from 'react';

const Example = () => {
  return <div className="p-4"><span className="p-2"></span></div>;
};

export default Example;`,
    });

    expect(result).toEqual(`import React from 'react';

const Example = () => {
  return <div className="p-4"><span className="p-4"></span></div>;
};

export default Example;`);
  });

  it('should add className to div with no className', () => {
    const result = updateClassName({
      lineNumber: 4,
      columnNumber: 10,
      className: 'p-4',
      text: `import React from 'react';

const Example = () => {
  return <div></div>;
};

export default Example;`,
    });

    expect(result).toEqual(`import React from 'react';

const Example = () => {
  return <div className="p-4"></div>;
};

export default Example;`);
  });
});

describe('Element Append', () => {
  it('should append div inside another div', () => {
    const result = appendElement({
      lineNumber: 4,
      columnNumber: 10,
      element: 'div',
      text: `import React from 'react';

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
});

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
