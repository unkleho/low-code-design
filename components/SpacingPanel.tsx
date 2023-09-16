import React from 'react';

import Panel from './Panel';
import PanelRow from './PanelRow';

import { FormField, useCodesignStore } from '../lib/store/store';

const SpacingPanel = () => {
  const { form, setCurrentField, setFormValue } = useCodesignStore();

  return (
    <Panel title="Spacing" name="spacing">
      <div className="p-3">
        {['margin', 'padding'].map((spacing) => {
          return (
            <PanelRow label={spacing} key={spacing}>
              {[
                { side: 't', field: `${spacing}Top` },
                { side: 'r', field: `${spacing}Right` },
                { side: 'b', field: `${spacing}Bottom` },
                { side: 'l', field: `${spacing}Left` },
              ].map((space: { side: string; field: FormField }) => {
                return (
                  <input
                    type="text"
                    placeholder={space.side}
                    value={form[space.field] || ''}
                    className={`flex-1 w-full p-1 mr-1 border border-${space.side}-4`}
                    key={space.side}
                    onFocus={() => setCurrentField(space.field)}
                    onChange={(event) => {
                      const { value } = event.target;

                      setFormValue(space.field, value);
                    }}
                  />
                );
              })}
            </PanelRow>
          );
        })}
      </div>
    </Panel>
  );
};

export default SpacingPanel;
