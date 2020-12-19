import React from 'react';
import { ControlledEditor } from '@monaco-editor/react';
import rehype from 'rehype';

const MonacoPage = () => {
  const defaultValue = '<p>Hello</p>';
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    const ast = rehype()
      .data('settings', {
        fragment: true,
      })
      .parse(value);

    ast.children[0].properties.className[0] = 'text-sm';
    ast.children[0].properties.className[1] = 'ml-4';

    const newValue = rehype().stringify(ast);
    console.log(newValue);
  }, [value]);

  return (
    <div>
      <ControlledEditor
        height="50vh"
        language="html"
        theme="dark"
        value={value}
        options={{
          minimap: {
            enabled: false,
          },
        }}
        onChange={(event, value) => {
          console.log(event, value);
          setValue(value);
        }}
      />
      <div dangerouslySetInnerHTML={{ __html: value }}></div>
    </div>
  );
};

export default MonacoPage;
