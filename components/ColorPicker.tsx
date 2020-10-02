import React from 'react';
import { backgroundColors } from '../lib/tailwind-config';

type Props = {
  selectedColor?: string;
  className?: string;
  onColorClick?: Function;
};

const baseBgColors = Object.keys(backgroundColors);

const ColorPicker = ({ selectedColor, className, onColorClick }: Props) => {
  const buttons = React.useRef({});

  React.useEffect(() => {
    const currentButton = buttons.current[selectedColor];

    if (currentButton) {
      // Scroll currentButton container so it is visible
      currentButton.parentNode.parentNode.scrollTop =
        currentButton.offsetTop - 20;
    }
  }, [selectedColor]);

  const handleColorClick = (event, color) => {
    console.log(color);

    if (typeof onColorClick === 'function') {
      onColorClick(color);
    }
  };

  return (
    <div
      className={[
        'relative w-full h-16 overflow-scroll border bg-white',
        className,
      ].join(' ')}
      style={{
        padding: 2,
      }}
    >
      {baseBgColors.map((baseBgColor) => {
        const bgColors = backgroundColors[baseBgColor];

        return (
          <div className="flex w-full last:border-b" key={baseBgColor}>
            {bgColors.map((bgColor) => {
              const color = bgColor.replace('bg-', '');
              const isSelected = color === selectedColor;

              return (
                <button
                  type="button"
                  className={[
                    'relative flex-1 h-4 border-t border-l focus:outline-none last:border-r',
                    isSelected ? 'z-10' : '',
                  ].join(' ')}
                  style={{
                    margin: 0,
                    padding: 2,
                  }}
                  ref={(el) => (buttons.current[color] = el)}
                  onClick={(event) => handleColorClick(event, color)}
                >
                  <span
                    className={['block w-full h-full', bgColor].join(' ')}
                  ></span>
                  {isSelected && (
                    <span
                      className={[
                        'absolute top-0 left-0 block w-full h-full',
                      ].join(' ')}
                      style={{
                        outline: '1px solid gray',
                      }}
                    ></span>
                  )}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ColorPicker;
