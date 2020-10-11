import React from 'react';

import Panel from './Panel';
import PanelRow from './PanelRow';
import ColorPicker from './ColorPicker';
// import ColorPickerSelect from './ColorPickerSelect';

import { useDesignTools } from '../lib/contexts/design-tools-context';

const BackgroundPanel = () => {
  const { state, updateClassNameValue } = useDesignTools();
  const { backgroundColor } = state.form;

  return (
    <Panel title="Background" name="background">
      <div className="p-3">
        <PanelRow label="Color">
          <ColorPicker
            selectedColor={backgroundColor}
            onColorClick={(color) => {
              updateClassNameValue(`bg-${backgroundColor}`, `bg-${color}`);
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
