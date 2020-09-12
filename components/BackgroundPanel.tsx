import Panel from './Panel';
import PanelRow from './PanelRow';
import { useDesignTools, types } from '../lib/contexts/design-tools-context';

const backgroundColors = {
  gray: [
    'bg-gray-100',
    'bg-gray-200',
    'bg-gray-300',
    'bg-gray-400',
    'bg-gray-500',
    'bg-gray-600',
    'bg-gray-700',
    'bg-gray-800',
    'bg-gray-900',
  ],
  red: [
    'bg-red-100',
    'bg-red-200',
    'bg-red-300',
    'bg-red-400',
    'bg-red-500',
    'bg-red-600',
    'bg-red-700',
    'bg-red-800',
    'bg-red-900',
  ],
  orange: [
    'bg-orange-100',
    'bg-orange-200',
    'bg-orange-300',
    'bg-orange-400',
    'bg-orange-500',
    'bg-orange-600',
    'bg-orange-700',
    'bg-orange-800',
    'bg-orange-900',
  ],
  yellow: [
    'bg-yellow-100',
    'bg-yellow-200',
    'bg-yellow-300',
    'bg-yellow-400',
    'bg-yellow-500',
    'bg-yellow-600',
    'bg-yellow-700',
    'bg-yellow-800',
    'bg-yellow-900',
  ],
  green: [
    'bg-green-100',
    'bg-green-200',
    'bg-green-300',
    'bg-green-400',
    'bg-green-500',
    'bg-green-600',
    'bg-green-700',
    'bg-green-800',
    'bg-green-900',
  ],
  teal: [
    'bg-teal-100',
    'bg-teal-200',
    'bg-teal-300',
    'bg-teal-400',
    'bg-teal-500',
    'bg-teal-600',
    'bg-teal-700',
    'bg-teal-800',
    'bg-teal-900',
  ],
  blue: [
    'bg-blue-100',
    'bg-blue-200',
    'bg-blue-300',
    'bg-blue-400',
    'bg-blue-500',
    'bg-blue-600',
    'bg-blue-700',
    'bg-blue-800',
    'bg-blue-900',
  ],
  purple: [
    'bg-purple-100',
    'bg-purple-200',
    'bg-purple-300',
    'bg-purple-400',
    'bg-purple-500',
    'bg-purple-600',
    'bg-purple-700',
    'bg-purple-800',
    'bg-purple-900',
  ],
  indigo: [
    'bg-indigo-100',
    'bg-indigo-200',
    'bg-indigo-300',
    'bg-indigo-400',
    'bg-indigo-500',
    'bg-indigo-600',
    'bg-indigo-700',
    'bg-indigo-800',
    'bg-indigo-900',
  ],
  pink: [
    'bg-pink-100',
    'bg-pink-200',
    'bg-pink-300',
    'bg-pink-400',
    'bg-pink-500',
    'bg-pink-600',
    'bg-pink-700',
    'bg-pink-800',
    'bg-pink-900',
  ],
};

const BackgroundPanel = ({ onColorClick }) => {
  const { state, dispatch, updateCurrentField } = useDesignTools();

  // const baseBgColor = state.form.backgroundColor?.split('-')[0];
  const baseBgColor = 'gray';

  return (
    <Panel title="Background">
      <div className="p-3">
        <PanelRow label="Color">
          {/* {renderTextInput({
          field: 'backgroundColor',
        })} */}

          <div className="w-full">
            {/* <div className="flex items-end w-full">
              {[
                'bg-gray-500',
                'bg-red-500',
                'bg-orange-500',
                'bg-yellow-500',
                'bg-green-500',
                'bg-teal-500',
                'bg-blue-500',
                'bg-indigo-500',
                'bg-purple-500',
                'bg-pink-500',
              ].map((bg) => {
                const isSelected =
                  bg.replace('bg-', '').replace('-500', '') ===
                  state.form.backgroundColor?.split('-')[0];

                return (
                  <button
                    type="button"
                    className={[
                      isSelected ? 'h-5' : 'h-4',
                      'flex-1',
                      'border-r border-gray-100',
                      bg,
                    ].join(' ')}
                  ></button>
                );
              })}
            </div> */}
            <div className="flex w-full">
              {backgroundColors[baseBgColor]?.map((bg) => {
                const isSelected =
                  bg.replace('bg-', '') === state.form.backgroundColor;

                return (
                  <button
                    type="button"
                    className={[
                      // isSelected ? 'shadow-outline' : '',
                      'flex-1 h-4 mr-1 border border-gray-100 shadow-xs last:mr-0',
                      bg,
                    ].join(' ')}
                    style={{
                      ...(isSelected
                        ? {
                            outline:
                              '1px solid rgba(160, 174, 192, var(--bg-opacity))',
                          }
                        : {}),
                    }}
                    onFocus={() => {
                      updateCurrentField('backgroundColor');
                    }}
                    onClick={() => {
                      dispatch({
                        type: types.UPDATE_FORM_VALUE,
                        key: 'backgroundColor',
                        value: bg.replace('bg-', ''),
                      });

                      onColorClick(bg);
                    }}
                  ></button>
                );
              })}
            </div>
          </div>
          {/* <input
          className="w-full p-1 border"
          type="text"
          value={state.form.backgroundColor || ''}
          onFocus={() => updateCurrentField('backgroundColor')}
          onChange={(event) => {
            const { value } = event.target;

            dispatch({
              type: types.UPDATE_FORM_VALUE,
              key: 'backgroundColor',
              value,
            });
          }}
        /> */}
        </PanelRow>
      </div>
    </Panel>
  );
};

export default BackgroundPanel;
