import React from 'react';

import Panel from './Panel';
import PanelRow from './PanelRow';
import { useDesignTools, types } from '../lib/contexts/design-tools-context';

const ElementPanel = () => {
  const [classInputValue, setClassInputValue] = React.useState('');

  const { state, updateCurrentField, dispatch } = useDesignTools();
  const { className, selectedNode } = state;

  const type = selectedNode?.type;
  const lineNumber = selectedNode?._debugSource?.lineNumber;
  const columnNumber = selectedNode?._debugSource?.columnNumber;
  const fileName = selectedNode?._debugSource?.fileName;

  // --------------------------------------------------------------------------
  // Effects
  // --------------------------------------------------------------------------

  // Set initial className when there is a new selectedNode
  React.useEffect(() => {
    setClassInputValue(className);
  }, [className]);

  const handleClassInputChange = (event) => {
    const newValue = event.target.value;

    setClassInputValue(newValue);

    dispatch({
      type: types.UPDATE_FORM_VALUE,
      key: 'className',
      value: newValue,
    });
  };

  return (
    <Panel title="Element">
      <div className="p-3">
        <PanelRow label="Type">
          {type && (
            <span
              className="px-2 py-1 font-bold bg-gray-200"
              title={`Line ${lineNumber}, column ${columnNumber}, ${fileName}`}
            >
              {type}
            </span>
          )}
        </PanelRow>

        <PanelRow label="Class">
          <input
            type="text"
            value={classInputValue || ''}
            className="p-1 flex-1 border border-blue"
            onFocus={() => updateCurrentField('className')}
            onChange={handleClassInputChange}
          />
        </PanelRow>
      </div>
    </Panel>
  );
};

export default ElementPanel;
