import Panel from './Panel';
import PanelRow from './PanelRow';

import classNameValues from '../lib/class-name-values';
import { useCodesignStore } from '../lib/store/store';

const EffectPanel = () => {
  const { form, setClassNameValue } = useCodesignStore();

  return (
    <Panel title="Effect" name="effect">
      <div className="p-3">
        <PanelRow label="Opacity">
          <select
            className="p-1 border"
            value={form.opacity || ''}
            onChange={(event) => {
              const { value } = event.target;

              setClassNameValue(
                form.opacity ? `opacity-${form.opacity}` : '',
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
