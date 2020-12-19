import React from 'react';
import { ControlledEditor } from '@monaco-editor/react';

const MonacoPage = () => {
  const defaultValue = '<p>Hello</p>';
  const [value, setValue] = React.useState(defaultValue);

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
