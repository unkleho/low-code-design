import Panel from './Panel';
import PanelRow from './PanelRow';

import { useCodesign } from '../lib/contexts/codesign-context';
import classNameValues from '../lib/class-name-values';

const EffectPanel = () => {
  const { state, updateClassNameValue } = useCodesign();

  return (
    <Panel title="Effect" name="effect">
      <div className="p-3">
        <PanelRow label="Opacity">
          <select
            className="p-1 border"
            value={state.opacity || ''}
            onChange={(event) => {
              const { value } = event.target;

              updateClassNameValue(
                state.opacity ? `opacity-${state.opacity}` : '',
                value ? `opacity-${value}` : '',
              );
            }}
          >
            <option label=" "></option>
            {classNameValues.opacity.map((option) => {
              return (
                <option value={option} key={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </PanelRow>
      </div>
    </Panel>
  );
};

export default EffectPanel;
