type PanelRowProps = {
  label: string;
  children: React.ReactNode;
};

const PanelRow = ({ label, children }: PanelRowProps) => {
  return (
    <div className="flex items-center mb-2 last:mb-0">
      <label className="w-16 mr-2 text-xs capitalize text-gray-500">
        {label}
      </label>
      <div className="flex flex-1">{children}</div>
    </div>
  );
};

export default PanelRow;
