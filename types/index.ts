import { FiberNode as FiberNodeBase } from 'react-fiber-traverse/dist/mocked-types';
import { RehypeNode } from '../lib/rehype-utils';

/**
 * Node type to build elements in design tool's layers panel
 */
export type DesignToolNode = RehypeNode & {
  isSelected?: boolean;
};

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
