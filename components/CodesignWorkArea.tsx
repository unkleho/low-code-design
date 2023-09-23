'use client';

import { ReactNode } from 'react';
import { TargetEvent } from '../types';
import { HighlightElement } from './HighlightElement';
import { CODESIGN_ROOT_ID } from '../lib/html-element-utils';

type Props = {
  className?: string;
  children: ReactNode;
  onClick: (event: TargetEvent) => void;
};

export const CodesignWorkArea = ({ className, onClick, children }: Props) => {
  return (
    <>
      <HighlightElement />

      <div
        id={CODESIGN_ROOT_ID}
        className={className}
        onClick={(event: TargetEvent) => {
          // Stop <a> links from navigating away
          event.preventDefault();

          if (typeof onClick === 'function') {
            if (event.target.id === CODESIGN_ROOT_ID) {
              onClick({
                ...event,
                target: null,
              });
            } else {
              onClick(event);
            }
          }
        }}
      >
        {children}
      </div>
    </>
  );
};
