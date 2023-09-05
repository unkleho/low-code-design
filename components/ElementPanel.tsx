import React from 'react';

import Panel from './Panel';
import PanelRow from './PanelRow';
import { useCodesign, types } from '../lib/contexts/codesign-context';

const ElementPanel = () => {
  const [classInputValue, setClassInputValue] = React.useState('');
  const [textInputValue, setTextInputValue] = React.useState('');

  const { state, updateCurrentField, dispatch } = useCodesign();
  const { form, text, selectedNode } = state;
  const { className } = form;

  const type = selectedNode?.type;
  const lineNumber = selectedNode?._debugSource?.lineNumber;
  const columnNumber = selectedNode?._debugSource?.columnNumber;
  const fileName = selectedNode?._debugSource?.fileName;

  // console.log(state.text);

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

    dispatch({
      type: types.UPDATE_FORM_VALUE,
      key: 'className',
      value: newValue,
    });
  };

  const handleTextInputChange = (event) => {
    const newValue = event.target.value;

    setTextInputValue(newValue);

    dispatch({
      type: types.UPDATE_FORM_VALUE,
      key: 'text',
      value: newValue,
    });
  };

  return (
    <Panel title="Element" name="element">
      <div className="p-3">
        <PanelRow label="Type">
          {type && (
            <span
              className="px-2 py-1 font-bold bg-gray-200 rounded-md"
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
            onFocus={() => updateCurrentField('className')}
            onChange={handleClassInputChange}
          />
        </PanelRow>

        <PanelRow label="Text">
          <input
            type="text"
            value={textInputValue || ''}
            className="w-full p-1 flex-1 border border-blue"
            onFocus={() => updateCurrentField('text')}
            onChange={handleTextInputChange}
          />
        </PanelRow>
      </div>
    </Panel>
  );
};

export default ElementPanel;
