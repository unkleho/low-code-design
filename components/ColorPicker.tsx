import { Popover } from '@headlessui/react';
import { ColorPickerTiles } from './ColorPickerTiles';

type Props = {
  selectedColor?: string;
  onColourClick?: (colour: string) => void;
};

export const ColorPicker = ({ selectedColor, onColourClick }: Props) => {
  return (
    <Popover className="relative">
      <Popover.Button
        className={[`w-7 h-7 p-1 border rounded-sm bg-white`].join(' ')}
      >
        <div
          className={[
            `w-full h-full`,
            selectedColor ? `bg-${selectedColor}` : 'border',
            selectedColor === 'white' ? 'border' : '',
          ].join(' ')}
        >
          {!selectedColor && (
            <span
              className="block h-full bg-red-500"
              style={{
                width: 1,
                height: '110%',
                marginLeft: '10%',
                marginTop: '12%',
                transform: 'rotate(-45deg)',
                transformOrigin: '0% 0%',
              }}
            ></span>
          )}
        </div>
      </Popover.Button>

      <Popover.Panel className="absolute mt-1 z-10 w-48">
        <ColorPickerTiles
          selectedColor={selectedColor}
          onColorClick={onColourClick}
        ></ColorPickerTiles>
      </Popover.Panel>
    </Popover>
  );
};
