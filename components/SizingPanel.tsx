import Panel from './Panel';
import { useCodesignStore } from '../lib/store/store';

const SizingPanel = () => {
  const { form, setCurrentField, setFormValue } = useCodesignStore();

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
            value={form.width || ''}
            onFocus={() => setCurrentField('width')}
            onChange={(event) => {
              const { value } = event.target;

              setFormValue('width', value);
            }}
          />
          <label className="text-xs mr-2">Min-Width</label>
          <input
            type="text"
            className="flex-1 w-full p-1 border"
            value={form.minWidth || ''}
            onFocus={() => setCurrentField('minWidth')}
            onChange={(event) => {
              const { value } = event.target;

              setFormValue('minWidth', value);
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
            value={form.height || ''}
            onFocus={() => setCurrentField('height')}
            onChange={(event) => {
              const { value } = event.target;

              setFormValue('height', value);
            }}
          />
          <label className="text-xs mr-2">Min-Height</label>
          <input
            type="text"
            className="flex-1 w-full p-1 border"
            value={form.minHeight || ''}
            onFocus={() => setCurrentField('minHeight')}
            onChange={(event) => {
              const { value } = event.target;

              setFormValue('minHeight', value);
            }}
          />
        </div>
      </div>
    </Panel>
  );
};

export default SizingPanel;
