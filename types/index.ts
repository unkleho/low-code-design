import { FiberNode as FiberNodeBase } from 'react-fiber-traverse/dist/mocked-types';

// TODO: Extend FiberNode with missing keys
export type FiberNode = FiberNodeBase & {
  return: FiberNode;
  type: string | Function;
  memoizedProps: {
    [key: string]: any;
  };
  stateNode: HTMLElement & {
    id?: number | string;
  };
  _debugID: number;
  _debugSource: {
    lineNumber: number;
    columnNumber: number;
    fileName: string;
  };
};
