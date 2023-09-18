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
        className={[`w-8 h-8 p-1 border rounded-sm bg-white`].join(' ')}
      >
        <div className={`w-full h-full bg-${selectedColor}`}></div>
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
