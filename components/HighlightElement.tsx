import { useEffect, useState } from 'react';
import { useCodesignStore } from '../lib/store/store';

export const HighlightElement = () => {
  const { getSelectedNode, form } = useCodesignStore();
  const selectedNode = getSelectedNode();
  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>();

  useEffect(() => {
    if (selectedNode?.stateNode) {
      // Need to wait a tick for element dimensions to update after form update
      const timer = setTimeout(() => {
        const {
          top,
          left,
          width,
          height,
        } = selectedNode.stateNode.getBoundingClientRect();

        // console.log(
        //   'HighlightElement',
        //   { top, left, width, height },
        //   // selectedNode.stateNode.getBoundingClientRect(),
        // );

        setRect({ top, left, width, height });
      }, 10);

      return () => clearTimeout(timer);
    } else {
      setRect(null);
    }
  }, [selectedNode, form.className]);

  if (!rect) {
    return null;
  }

  const { top, left, width, height } = rect;

  return (
    <div
      className="fixed outline outline-1 outline-cyan-400 pointer-events-none"
      style={{
        top,
        left,
        width,
        height,
      }}
    ></div>
  );
};
