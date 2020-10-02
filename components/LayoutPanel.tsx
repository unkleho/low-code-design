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
            value={state.position || ''}
            onChange={(event) => {
              const { value } = event.target;

              updateClassNameValue(state.position, value);
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
            value={state.display || ''}
            onChange={(event) => {
              const { value } = event.target;

              updateClassNameValue(state.display, value);
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
          {['right', 'down', 'left', 'up'].map((direction) => {
            const iconName = `arrow-narrow-${direction}` as ArrowNarrowDirection;

            return (
              <button
                className={['p-1 border mr-2 bg-white text-gray-400'].join(' ')}
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

export default LayoutPanel;
