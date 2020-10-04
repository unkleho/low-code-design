import React from 'react';

import Panel from './Panel';
import PanelRow from './PanelRow';
import ColorPicker from './ColorPicker';
// import ColorPickerSelect from './ColorPickerSelect';

import { useDesignTools, types } from '../lib/contexts/design-tools-context';

const BackgroundPanel = ({ onColorClick }) => {
  const { state, dispatch } = useDesignTools();
  const { backgroundColor } = state.form;

  return (
    <Panel title="Background" name="background">
      <div className="p-3">
        <PanelRow label="Color">
          <ColorPicker
            selectedColor={backgroundColor}
            onColorClick={(color) => {
              // TODO: Consider updateClassNameValue. Update Form value could be bypassed.
              dispatch({
                type: types.UPDATE_FORM_VALUE,
                key: 'backgroundColor',
                value: color,
              });

              onColorClick(`bg-${color}`);
            }}
          />
        </PanelRow>

        {/* Alternative Color Picker */}
        {/* <PanelRow label="Color">
          <ColorPickerSelect
            selectedColor={backgroundColor}
            onColorClick={(color) => {
              dispatch({
                type: types.UPDATE_FORM_VALUE,
                key: 'backgroundColor',
                value: color,
              });

              onColorClick(`bg-${color}`);
            }}
          />
        </PanelRow> */}
      </div>
    </Panel>
  );
};

export default BackgroundPanel;
