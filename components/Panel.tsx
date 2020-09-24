import Icon from './Icon';
import { useDesignTools } from '../lib/contexts/design-tools-context';

type PanelProps = {
  title: string;
  name: string;
  children: React.ReactNode;
};

const Panel = ({ title, name, children }: PanelProps) => {
  const { state, togglePanelStatus } = useDesignTools();
  const panel = state.panels.find((panel) => panel.name === name);

  return (
    <div className="border-b">
      <div className="flex px-3 py-2 bg-gray-200 border-b">
        <h2 className="mr-auto font-bold text-xs">{title}</h2>

        <button
          onClick={() => {
            togglePanelStatus(name);
          }}
          type="button"
        >
          <Icon
            name={panel?.status === 'open' ? 'chevron-up' : 'chevron-down'}
          />
        </button>
      </div>

      {panel.status === 'open' && <div>{children}</div>}
    </div>
  );
};

export default Panel;
