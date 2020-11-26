import Panel from './Panel';
// import PanelRow from './PanelRow';
import { useDesignTools, types } from '../lib/contexts/design-tools-context';

const SizingPanel = () => {
  const { state, updateCurrentField, dispatch } = useDesignTools();

  return (
    <Panel title="Sizing" name="sizing">
      <div className="p-3">
        <div className="flex items-baseline mb-2">
          <label className="w-16 mr-2 text-xs" htmlFor="element-width">
            Width
          </label>
          <input
            type="text"
            id="element-width"
            className="flex-1 w-full p-1 mr-4 border"
            value={state.form.width || ''}
            onFocus={() => updateCurrentField('width')}
            onChange={(event) => {
              const { value } = event.target;

              dispatch({
                type: types.UPDATE_FORM_VALUE,
                key: 'width',
                value,
              });
            }}
          />
          <label className="text-xs mr-2">Min-Width</label>
          <input
            type="text"
            className="flex-1 w-full p-1 border"
            value={state.form.minWidth || ''}
            onFocus={() => updateCurrentField('minWidth')}
            onChange={(event) => {
              const { value } = event.target;

              dispatch({
                type: types.UPDATE_FORM_VALUE,
                key: 'minWidth',
                value,
              });
            }}
          />
        </div>
        <div className="flex items-baseline">
          <label className="w-16 mr-2 text-xs" htmlFor="element-height">
            Height
          </label>
          <input
            type="text"
            id="element-height"
            className="flex-1 w-full p-1 mr-4 border"
            value={state.form.height || ''}
            onFocus={() => updateCurrentField('height')}
            onChange={(event) => {
              const { value } = event.target;

              dispatch({
                type: types.UPDATE_FORM_VALUE,
                key: 'height',
                value,
              });
            }}
          />
          <label className="text-xs mr-2">Min-Height</label>
          <input
            type="text"
            className="flex-1 w-full p-1 border"
            value={state.form.minHeight || ''}
            onFocus={() => updateCurrentField('minHeight')}
            onChange={(event) => {
              const { value } = event.target;

              dispatch({
                type: types.UPDATE_FORM_VALUE,
                key: 'minHeight',
                value,
              });
            }}
          />
        </div>
      </div>
    </Panel>
  );
};

export default SizingPanel;
