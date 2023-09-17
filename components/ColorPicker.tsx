import React from 'react';
import { backgroundColors } from '../lib/tailwind-config';

type Props = {
  selectedColor?: string;
  className?: string;
  onColorClick?: Function;
};

const baseBgColors = Object.keys(backgroundColors);

const ColorPicker = ({ selectedColor, className, onColorClick }: Props) => {
  const handleColorClick = (event, color) => {
    if (typeof onColorClick === 'function') {
      onColorClick(color);
    }
  };

  return (
    <div
      className={[
        'relative w-full h-[76px] overflow-scroll border bg-white rounded-sm',
        className,
      ].join(' ')}
      style={{
        padding: 2,
      }}
    >
      <div
        className="flex last:border-b"
        style={{
          width: '34%',
        }}
      >
        <ColorTile
          bgColor={''}
          isSelected={!selectedColor}
          onColorClick={handleColorClick}
        />
        <ColorTile
          bgColor={'bg-white'}
          isSelected={selectedColor === 'white'}
          onColorClick={handleColorClick}
        />
        <ColorTile
          bgColor={'bg-black'}
          isSelected={selectedColor === 'black'}
          onColorClick={handleColorClick}
        />
      </div>

      {baseBgColors.map((baseBgColor) => {
        const bgColors = backgroundColors[baseBgColor];

        return (
          <div className="flex w-full last:border-b" key={baseBgColor}>
            {bgColors.map((bgColor) => {
              const color = bgColor.replace('bg-', '');
              const isSelected = color === selectedColor;

              return (
                <ColorTile
                  bgColor={bgColor}
                  isSelected={isSelected}
                  onColorClick={handleColorClick}
                  key={bgColor}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

type ColorTileProps = {
  bgColor: string;
  isSelected?: boolean;
  onColorClick?: Function;
};

const ColorTile = ({
  bgColor,
  isSelected = false,
  onColorClick,
}: ColorTileProps) => {
  const button = React.useRef<HTMLButtonElement>();
  const color = bgColor.replace('bg-', '');

  React.useEffect(() => {
    if (button && isSelected) {
      // Scroll button container so it is visible
      button.current.parentElement.parentElement.scrollTop =
        button.current.offsetTop - 20;
    }
  }, [isSelected]);

  return (
    <button
      type="button"
      className={[
        'relative flex-1 h-5 border-t border-l focus:outline-none last:border-r',
        isSelected ? 'z-10' : '',
      ].join(' ')}
      style={{
        margin: 0,
        padding: 2,
      }}
      title={color}
      ref={button}
      onClick={(event) => onColorClick(event, color)}
    >
      {color ? (
        <span className={['block w-full h-full', bgColor].join(' ')}></span>
      ) : (
        <span
          className="block h-full bg-red-500"
          style={{
            width: 1,
            height: '145%',
            transform: 'rotate(-45deg)',
            transformOrigin: '0% 0%',
          }}
        ></span>
      )}

      {isSelected && (
        <span
          className={['absolute top-0 left-0 block w-full h-full'].join(' ')}
          style={{
            outline: '1px solid gray',
          }}
        ></span>
      )}
    </button>
  );
};

export default ColorPicker;
