import Icon from './Icon';

const ControlPanel = ({ onClick }) => {
  return (
    <div className="sticky top-0 w-full bg-gray-100 border-b">
      <button className="px-2 py-1" onClick={onClick}>
        <Icon name="chevron-left" />
      </button>
    </div>
  );
};

export default ControlPanel;
