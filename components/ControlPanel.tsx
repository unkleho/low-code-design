import { types, useDesignTools } from '../lib/contexts/design-tools-context';
import Icon from './Icon';

const ControlPanel = () => {
  const { dispatch } = useDesignTools();

  return (
    <div className="sticky top-0 w-full bg-gray-300">
      <button
        className="px-2 py-1"
        onClick={() => {
          dispatch({
            type: types.TOGGLE_DESIGN_TOOLS,
          });
        }}
      >
        <Icon name="chevron-left" />
      </button>
    </div>
  );
};

export default ControlPanel;
