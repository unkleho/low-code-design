import React from 'react';

import Panel from './Panel';
import PanelRow from './PanelRow';
import { useCodesignStore } from '../lib/store/store';

const ElementPanel = () => {
  const [classInputValue, setClassInputValue] = React.useState('');
  const [textInputValue, setTextInputValue] = React.useState('');

  const {
    setCurrentField,
    form,
    setFormValue,
    selectedNodes,
  } = useCodesignStore();
  const { text, className } = form;

  // TODO: Multi-select one day
  const selectedNode = selectedNodes?.[0];

  const type = selectedNode?.type as string;
  const lineNumber = selectedNode?._debugSource?.lineNumber;
  const columnNumber = selectedNode?._debugSource?.columnNumber;
  const fileName = selectedNode?._debugSource?.fileName;

  // console.log('ElementPanel', { text, className, type });

  // --------------------------------------------------------------------------
  // Effects
  // --------------------------------------------------------------------------

  // Set initial className when there is a new selectedNode
  React.useEffect(() => {
    setClassInputValue(className);
  }, [className]);

  // Set initial text when there is a new selectedNode
  React.useEffect(() => {
    setTextInputValue(text);
  }, [text]);

  const handleClassInputChange = (event) => {
    const newValue = event.target.value;

    setClassInputValue(newValue);
  };

  const handleTextInputChange = (event) => {
    const newValue = event.target.value;

    setTextInputValue(newValue);

    setFormValue('text', newValue);
  };

  return (
    <Panel title="Element" name="element">
      <div className="px-4">
        <PanelRow label="Type">
          {type && (
            <span
              className="px-2 py-1 font-bold bg-gray-200 rounded-sm"
              title={`Line ${lineNumber}, column ${columnNumber}, ${fileName}`}
            >
              {type}
            </span>
          )}
        </PanelRow>

        {/* TODO: Apply to all buttons and inputs: focus:outline-none focus:border-blue-500 */}

        <PanelRow label="Class">
          <input
            type="text"
            value={classInputValue || ''}
            className="w-full p-1 flex-1 border border-blue"
            onFocus={() => setCurrentField('className')}
            onChange={handleClassInputChange}
          />
        </PanelRow>

        <PanelRow label="Text">
          <input
            type="text"
            value={textInputValue || ''}
            className="w-full p-1 flex-1 border border-blue"
            onFocus={() => setCurrentField('text')}
            onChange={handleTextInputChange}
          />
        </PanelRow>
      </div>
    </Panel>
  );
};

export default ElementPanel;
