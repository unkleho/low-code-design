import Icon from './Icon';

type PanelProps = {
  title: string;
  children: React.ReactNode;
};

const Panel = ({ title, children }: PanelProps) => {
  return (
    <div className="border-b">
      <div className="flex px-3 py-2 bg-gray-200 border-b">
        <h2 className="mr-auto font-bold">{title}</h2>
        <Icon name="chevron-down" />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Panel;
