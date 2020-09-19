// import React from 'react'
import { useSelect } from 'downshift';

type Props = {
  items: {
    name: string;
    value: string | number;
  }[];
};

const Select = ({ items = [] }: Props) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    // getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({ items });
  return (
    <div className="relative">
      {/* <label {...getLabelProps()}>Choose an element:</label> */}
      <button
        type="button"
        {...getToggleButtonProps()}
        className="px-2 py-1 mb-2 border bg-white"
      >
        {selectedItem?.name || 'Choose'}
      </button>

      <ul {...getMenuProps()} className="absolute -mt-2 bg-white border">
        {isOpen &&
          items.map((item, index) => (
            <li
              style={
                highlightedIndex === index ? { backgroundColor: '#bde4ff' } : {}
              }
              key={`${item.value}${index}`}
              {...getItemProps({ item, index })}
              className="px-2 py-1"
            >
              {item.name}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Select;
