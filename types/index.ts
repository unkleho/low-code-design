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

export type TargetEvent = React.MouseEvent<HTMLDivElement, MouseEvent> & {
  target: HTMLElement;
  _targetInst: FiberNode;
};

export type NodeChangeEvent = {
  type: 'UPDATE_FILE_CLASS_NAME' | 'UPDATE_FILE_TEXT';
  node: FiberNode;
  className?: string;
  text?: string;
};
