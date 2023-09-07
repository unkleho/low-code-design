import { ReactNode } from 'react';
import { TargetEvent } from '../types';

type Props = {
  className?: string;
  children: ReactNode;
  onClick: (event: TargetEvent) => void;
};

export const CodesignWorkArea = ({ className, onClick, children }: Props) => {
  return (
    <div
      id="__codesign"
      className={className}
      onClick={(event: TargetEvent) => {
        // Stop <a> links from navigating away
        event.preventDefault();

        if (typeof onClick === 'function') {
          onClick(event);
        }
      }}
    >
      {children}
    </div>
  );
};
