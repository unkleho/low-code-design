import { FiberNode } from '../types';

export function getReactFiberInstance(element: EventTarget & HTMLElement) {
  const targetInstKey = Object.keys(element).find((key) => {
    if (key.startsWith('__reactFiber$')) {
      return true;
    }

    return null;
  });
  const targetInst = element[targetInstKey];

  return targetInst as FiberNode;
}

export function getFiberNodeId(node: FiberNode) {
  return `${node._debugSource.fileName}-${node._debugSource.lineNumber}-${node._debugSource.columnNumber}-${node.key}`;
  // return `${node.flags}-${node.index}-${node.subtreeFlags}`;
}
