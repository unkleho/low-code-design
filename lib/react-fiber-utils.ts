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
