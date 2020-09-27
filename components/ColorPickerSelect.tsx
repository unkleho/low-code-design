import React from 'react';

import Select from './Select';
import Icon from './Icon';

import { backgroundColors } from '../lib/tailwind-config';
const baseBgColors = Object.keys(backgroundColors);

const ColorPickerSelect = ({ selectedColor, onColorClick }) => {
  const [baseBgColor, setBaseBgColor] = React.useState<React.ReactText>('gray');
  const baseBgItems = baseBgColors.map((color) => {
    return {
      name: color.charAt(0).toUpperCase() + color.slice(1),
      value: color,
    };
  });

  React.useEffect(() => {
    const newBaseBgColor = selectedColor?.split('-')[0];

    setBaseBgColor(newBaseBgColor);
  }, [selectedColor]);

  return (
    <div className="w-full">
      <Select
        items={baseBgItems}
        defaultSelectedItem={baseBgItems.find(
          (item) => item.value === baseBgColor
        )}
        renderToggleButton={(props, selectedItem) => {
          const itemBgColor = selectedItem.value
            ? backgroundColors[selectedItem.value][4]
            : null;

          return (
            <button
              {...props}
              className={[props.className, 'flex', 'items-center'].join(' ')}
            >
              {selectedItem?.name ? (
                <>
                  <div
                    className={['w-4 h-4 mr-2', itemBgColor].join(' ')}
                  ></div>{' '}
                  {selectedItem.name}
                  <Icon
                    name={
                      props['aria-expanded'] ? 'chevron-up' : 'chevron-down'
                    }
                    className="ml-2"
                  />
                </>
              ) : (
                'Choose color'
              )}
            </button>
          );
        }}
        // TODO: Improve renderItem props
        renderItem={(props, item, index, isHighlighted, selectedItem) => {
          const itemBgColor = backgroundColors[item.value][4];
          const isSelected = selectedItem.value === item.value;

          return (
            <li
              {...props}
              key={item.name}
              className={[
                'flex items-center px-2 py-1',
                isSelected ? 'font-bold' : '',
                isHighlighted ? 'bg-gray-300' : '',
              ].join(' ')}
            >
              <div className={['w-4 h-4 mr-2', itemBgColor].join(' ')}></div>{' '}
              {item.name}
            </li>
          );
        }}
        onChange={(event) => {
          const { selectedItem } = event;
          setBaseBgColor(selectedItem.value);
        }}
      />

      <div className="flex w-full">
        {backgroundColors[baseBgColor]?.map((bgColor) => {
          const color = bgColor.replace('bg-', '');
          const isSelected = color === selectedColor;

          return (
            <button
              type="button"
              className={[
                // isSelected ? 'shadow-outline' : '',
                'flex-1 h-4 mr-1 border border-gray-100 shadow-xs last:mr-0',
                bgColor,
              ].join(' ')}
              style={{
                ...(isSelected
                  ? {
                      outline:
                        '1px solid rgba(160, 174, 192, var(--bg-opacity))',
                    }
                  : {}),
              }}
              // onFocus={() => {
              //   if (state.currentField !== 'backgroundColor') {
              //     updateCurrentField('backgroundColor');
              //   }
              // }}
              onClick={() => onColorClick(color)}
              key={bgColor}
            ></button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPickerSelect;
