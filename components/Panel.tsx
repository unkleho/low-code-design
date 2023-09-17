import Icon from './Icon';
import { PanelName, useCodesignStore } from '../lib/store/store';

type PanelProps = {
  title: string;
  name: PanelName;
  children: React.ReactNode;
};

const Panel = ({ title, name, children }: PanelProps) => {
  const { panels, togglePanelStatus } = useCodesignStore();
  const panel = panels.find((panel) => panel.name === name);

  return (
    <div className="border-b">
      <div className="flex items-center px-4 pt-4 pb-4">
        <h2 className="mr-auto font-semibold text-xs leading-none text-gray-800">
          {title}
        </h2>

        <button
          onClick={() => {
            togglePanelStatus(name);
          }}
          type="button"
        >
          <Icon
            name={panel?.status === 'open' ? 'chevron-down' : 'chevron-up'}
          />
        </button>
      </div>

      {panel.status === 'open' && <div className="pb-4">{children}</div>}
    </div>
  );
};

export default Panel;
