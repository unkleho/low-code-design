import React from 'react';

import Panel from './Panel';
import PanelRow from './PanelRow';
import ColorPicker from './ColorPicker';
// import ColorPickerSelect from './ColorPickerSelect';

import { useCodesignStore } from '../lib/store/store';

const BackgroundPanel = () => {
  const { form, setClassNameValue } = useCodesignStore();
  const { backgroundColor } = form;

  return (
    <Panel title="Background" name="background">
      <div className="px-4">
        <PanelRow label="Color">
          <ColorPicker
            selectedColor={backgroundColor}
            onColorClick={(color) => {
              setClassNameValue(
                backgroundColor ? `bg-${backgroundColor}` : '',
                color ? `bg-${color}` : '',
              );
            }}
          />
        </PanelRow>

        {/* Alternative Color Picker */}
        {/* <PanelRow label="Color">
          <ColorPickerSelect
            selectedColor={backgroundColor}
            onColorClick={(color) => {
              updateClassNameValue(`bg-${backgroundColor}`, `bg-${color}`);
            }}
          />
        </PanelRow> */}
      </div>
    </Panel>
  );
};

export default BackgroundPanel;
