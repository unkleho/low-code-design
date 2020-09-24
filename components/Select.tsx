// import React from 'react'
import { useSelect, UseSelectStateChange } from 'downshift';

type Props = {
  items: {
    name: string;
    value: string | number;
  }[];
  defaultSelectedItem?: {
    name: string;
    value: string | number;
  };
  renderItem?: Function;
  renderToggleButton?: Function;
  onChange?: (
    changes: UseSelectStateChange<{
      name: string;
      value: string | number;
    }>
  ) => void;
};

const Select = ({
  items = [],
  defaultSelectedItem = {
    name: null,
    value: null,
  },
  renderItem,
  renderToggleButton,
  onChange,
}: Props) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    // getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items,
    selectedItem: defaultSelectedItem,
    onSelectedItemChange: onChange,
  });

  return (
    <div className="relative">
      {/* <label {...getLabelProps()}>Choose an element:</label> */}
      {typeof renderToggleButton === 'function' ? (
        renderToggleButton(
          {
            ...getToggleButtonProps(),
            className: 'px-2 py-1 mb-2 border bg-white',
          },
          selectedItem
        )
      ) : (
        <button
          type="button"
          {...getToggleButtonProps()}
          className="px-2 py-1 mb-2 border bg-white"
        >
          {selectedItem?.name || 'Choose'}
        </button>
      )}

      <ul {...getMenuProps()} className="absolute -mt-2 bg-white border">
        {isOpen &&
          items.map((item, index) => {
            const isHighlighted = highlightedIndex === index;

            if (typeof renderItem === 'function') {
              return renderItem(
                {
                  ...getItemProps({ item, index }),
                  className: 'px-2 py-1',
                },
                item,
                index,
                isHighlighted,
                selectedItem
              );
            } else {
              return (
                <li
                  style={
                    highlightedIndex === index
                      ? { backgroundColor: '#bde4ff' }
                      : {}
                  }
                  key={`${item.value}${index}`}
                  {...getItemProps({ item, index })}
                  className="px-2 py-1"
                >
                  {item.name}
                </li>
              );
            }
          })}
      </ul>
    </div>
  );
};

export default Select;
