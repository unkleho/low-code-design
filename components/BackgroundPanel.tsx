import React from 'react';

import Panel from './Panel';
import PanelRow from './PanelRow';
import { useCodesignStore } from '../lib/store/store';
import { ColorPicker } from './ColorPicker';

const BackgroundPanel = () => {
  const { form, setClassNameValue } = useCodesignStore();
  const { backgroundColor } = form;

  return (
    <Panel title="Background" name="background">
      <div className="px-4">
        <PanelRow label="Color">
          <ColorPicker
            selectedColor={backgroundColor}
            onColourClick={(color) => {
              setClassNameValue(
                backgroundColor ? `bg-${backgroundColor}` : '',
                color ? `bg-${color}` : '',
              );
            }}
          />
        </PanelRow>
      </div>
    </Panel>
  );
};

export default BackgroundPanel;
