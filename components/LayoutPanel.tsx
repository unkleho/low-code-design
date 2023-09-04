import Panel from './Panel';
import PanelRow from './PanelRow';

import Icon from './Icon';

import { useDesignTools } from '../lib/contexts/design-tools-context';
import classNameValues from '../lib/class-name-values';

type ArrowNarrowDirection =
  | 'arrow-narrow-right'
  | 'arrow-narrow-down'
  | 'arrow-narrow-left'
  | 'arrow-narrow-up';

const LayoutPanel = () => {
  const { updateClassNameValue, state } = useDesignTools();

  return (
    <Panel title="Layout" name="layout">
      <div className="p-3">
        <PanelRow label="Position">
          <select
            className="p-1 border"
            value={state.form.position || ''}
            onChange={(event) => {
              const { value } = event.target;

              updateClassNameValue(state.form.position, value);
            }}
          >
            <option label=" "></option>
            {classNameValues.position.map((option) => {
              return (
                <option value={option} key={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </PanelRow>

        <PanelRow label="Display">
          <select
            className="p-1 border"
            value={state.form.display || ''}
            onChange={(event) => {
              const { value } = event.target;

              updateClassNameValue(state.form.display, value);
            }}
          >
            <option label=" "></option>
            {classNameValues.display.map((option) => {
              return (
                <option value={option} key={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </PanelRow>

        <PanelRow label="Direction">
          {['row', 'col', 'row-reverse', 'col-reverse'].map((flexDirection) => {
            const arrowDirection = flexDirectionArrows[flexDirection];
            const iconName = `arrow-narrow-${arrowDirection}` as ArrowNarrowDirection;
            const isSelected = flexDirection === state.form.flexDirection;

            return (
              <button
                type="button"
                className={[
                  'p-1 border mr-2 bg-white rounded-md',
                  isSelected
                    ? 'text-gray-700 border-gray-500'
                    : 'text-gray-400',
                ].join(' ')}
                onClick={() => {
                  updateClassNameValue(
                    `flex-${state.form.flexDirection}`,
                    `flex-${flexDirection}`,
                  );
                }}
                key={flexDirection}
              >
                <Icon name={iconName} />
              </button>
            );
          })}
        </PanelRow>
      </div>
    </Panel>
  );
};

const flexDirectionArrows = {
  row: 'right',
  'row-reverse': 'left',
  col: 'down',
  'col-reverse': 'up',
};

export default LayoutPanel;
