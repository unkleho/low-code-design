import { FiberNode as FiberNodeBase } from 'react-fiber-traverse/dist/mocked-types';

// TODO: Extend FiberNode with missing keys
export type FiberNode = FiberNodeBase & {
  /** Parent FiberNode */
  return: FiberNode;
  type: string | Function;
  memoizedProps: {
    [key: string]: any;
  };
  stateNode: HTMLElement & {
    id?: number | string;
  };
  flags: number;
  index: number;
  key?: string;
  lanes: number;
  mode: number;
  tag: number;
  subtreeFlags: number;
  elementDiv: string | null;
  _debugSource: {
    lineNumber: number;
    columnNumber: number;
    fileName: string;
  };
};

export type FiberNodeWithId = FiberNode & {
  /** Based on `flags` (parent) and `index` */
  id: string;
};

export type TargetEvent = React.MouseEvent<HTMLDivElement, MouseEvent> & {
  target: HTMLElement;
  _targetInst: FiberNode;
};

export type NodeChangeEvent =
  | {
      type: 'UPDATE_FILE_CLASS_NAME';
      node: FiberNode;
      className: string;
    }
  | {
      type: 'UPDATE_FILE_TEXT';
      node: FiberNode;
      text: string;
    }
  | {
      type: 'CREATE_FILE_ELEMENT';
      node: FiberNode;
      elementType: string;
    };
