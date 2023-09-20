import React from 'react';

import Panel from './Panel';
import PanelRow from './PanelRow';

import { FormField, useCodesignStore } from '../lib/store/store';

const SpacingPanel = () => {
  const { form, setCurrentField, setFormValue } = useCodesignStore();

  return (
    <Panel title="Spacing" name="spacing">
      <div className="px-4">
        {['margin', 'padding'].map((spacing) => {
          return (
            <PanelRow label={spacing} key={spacing}>
              {[
                {
                  side: 't',
                  field: `${spacing}Top`,
                  borderClassName: 'w-full h-1',
                },
                {
                  side: 'r',
                  field: `${spacing}Right`,
                  borderClassName: 'h-full w-1 right-0',
                },
                {
                  side: 'b',
                  field: `${spacing}Bottom`,
                  borderClassName: 'w-full h-1 bottom-0',
                },
                {
                  side: 'l',
                  field: `${spacing}Left`,
                  borderClassName: 'h-full w-1',
                },
              ].map(
                (space: {
                  side: string;
                  field: FormField;
                  borderClassName: string;
                }) => {
                  return (
                    <div className="relative mr-2 last:mr-0" key={space.side}>
                      <div
                        className={[
                          'absolute bg-gray-200',
                          space.borderClassName,
                        ].join(' ')}
                      ></div>
                      <input
                        type="text"
                        placeholder={space.side}
                        value={form[space.field] || ''}
                        className={`flex-1 w-full p-2 border border-${space.side}-gray-500`}
                        key={space.side}
                        onFocus={() => setCurrentField(space.field)}
                        onChange={(event) => {
                          const { value } = event.target;

                          setFormValue(space.field, value);
                        }}
                      />
                    </div>
                  );
                },
              )}
            </PanelRow>
          );
        })}
      </div>
    </Panel>
  );
};

export default SpacingPanel;
