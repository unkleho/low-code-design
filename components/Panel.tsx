import Icon from './Icon';
import { useCodesign } from '../lib/contexts/codesign-context';
import { PanelName, useCodesignStore } from '../lib/store/store';

type PanelProps = {
  title: string;
  name: PanelName;
  children: React.ReactNode;
};

const Panel = ({ title, name, children }: PanelProps) => {
  // const { state } = useCodesign();
  const { panels, togglePanelStatus } = useCodesignStore();
  const panel = panels.find((panel) => panel.name === name);

  return (
    <div className="border-b">
      <div className="flex px-3 pt-3 pb-1 bg-gray-100">
        <h2 className="mr-auto font-bold text-xs">{title}</h2>

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

      {panel.status === 'open' && <div>{children}</div>}
    </div>
  );
};

export default Panel;
