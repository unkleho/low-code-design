'use client';

import { ReactNode, useRef } from 'react';
import { TargetEvent } from '../types';
import { changeHighlightElement } from '../lib/html-element-utils';
import { useCodesignStore } from '../lib/store/store';
import { HighlightElement } from './HighlightElement';

type Props = {
  className?: string;
  children: ReactNode;
  onClick: (event: TargetEvent) => void;
};

export const CodesignWorkArea = ({ className, onClick, children }: Props) => {
  // const pathIndexes = useCodesignStore((state) =>
  //   state.getSelectedPathIndexes(),
  // );

  // console.log('CodesignWorkArea', pathIndexes);

  // const highlightElement = useRef<HTMLDivElement>();
  // // Top level preview element
  // const previewElement =
  //   typeof window === 'undefined'
  //     ? null
  //     : document.getElementById('__codesign');

  // TODO: Get this working.
  // useWindowSize(() => {
  //   const element = getSelectedElement(previewElement, ancestorIndexes);

  //   if (element) {
  //     const { top, left, width, height } = element.getBoundingClientRect();

  //     updateHighlightElement(highlightElement.current, {
  //       top,
  //       left,
  //       width,
  //       height,
  //     });
  //   }
  // });

  // changeHighlightElement(previewElement, highlightElement.current, pathIndexes);

  return (
    <>
      {/* TODO: Create new component for highlight. Get values from selectedNode */}
      {/* <div className="fixed" ref={highlightElement}></div> */}

      <HighlightElement />

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
    </>
  );
};
