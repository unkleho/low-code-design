import Icon from './Icon';
import { useCodesign } from '../lib/contexts/codesign-context';

type PanelProps = {
  title: string;
  name: string;
  children: React.ReactNode;
};

const Panel = ({ title, name, children }: PanelProps) => {
  const { state, togglePanelStatus } = useCodesign();
  const panel = state.panels.find((panel) => panel.name === name);

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
