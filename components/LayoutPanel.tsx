import Panel from './Panel';
import PanelRow from './PanelRow';

import Icon from './Icon';

import classNameValues from '../lib/class-name-values';
import { useCodesignStore } from '../lib/store/store';

type ArrowNarrowDirection =
  | 'arrow-narrow-right'
  | 'arrow-narrow-down'
  | 'arrow-narrow-left'
  | 'arrow-narrow-up';

const LayoutPanel = () => {
  const { form, setClassNameValue, setFormValue } = useCodesignStore();

  // console.log('LayoutPanel', form);

  return (
    <Panel title="Layout" name="layout">
      <div className="px-4">
        <PanelRow label="Position">
          <select
            className="p-1 border"
            value={form.position || ''}
            onChange={(event) => {
              const { value } = event.target;

              setClassNameValue(form.position, value);
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
            value={form.display || ''}
            onChange={(event) => {
              const { value } = event.target;

              setClassNameValue(form.display, value);
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
            const isSelected = flexDirection === form.flexDirection;

            return (
              <button
                type="button"
                className={[
                  'p-1 border mr-2 bg-white rounded-sm',
                  isSelected ? 'text-gray-700' : 'text-gray-300',
                ].join(' ')}
                onClick={() => {
                  setFormValue('flexDirection', flexDirection);
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
