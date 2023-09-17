import Panel from './Panel';
import { useCodesignStore } from '../lib/store/store';

const SizingPanel = () => {
  const { form, setCurrentField, setFormValue } = useCodesignStore();

  return (
    <Panel title="Sizing" name="sizing">
      <div className="px-4">
        <div className="flex items-baseline mb-2">
          <label
            className="w-16 mr-2 text-xs text-gray-500"
            htmlFor="sizing-width"
          >
            Width
          </label>
          <input
            type="text"
            id="sizing-width"
            className="flex-1 w-full p-1 mr-4 border"
            value={form.width || ''}
            onFocus={() => setCurrentField('width')}
            onChange={(event) => {
              const { value } = event.target;

              setFormValue('width', value);
            }}
          />
          <label
            className="text-xs mr-2 text-gray-500"
            htmlFor="sizing-min-width"
          >
            Min-Width
          </label>
          <input
            type="text"
            id="sizing-min-width"
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
          <label
            className="w-16 mr-2 text-xs text-gray-500"
            htmlFor="sizing-height"
          >
            Height
          </label>
          <input
            type="text"
            id="sizing-height"
            className="flex-1 w-full p-1 mr-4 border"
            value={form.height || ''}
            onFocus={() => setCurrentField('height')}
            onChange={(event) => {
              const { value } = event.target;

              setFormValue('height', value);
            }}
          />
          <label
            className="text-xs mr-2 text-gray-500"
            htmlFor="sizing-min-height"
          >
            Min-Height
          </label>
          <input
            type="text"
            id="sizing-min-height"
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
