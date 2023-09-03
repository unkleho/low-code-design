import { FiberNode as FiberNodeBase } from 'react-fiber-traverse/dist/mocked-types';

// TODO: Extend FiberNode with missing keys
export type FiberNode = FiberNodeBase & {
  /** Parent FiberNode */
  return: FiberNode;
  sibling: FiberNode;
  child: FiberNode;
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

/**
 * Node type to build elements in design tool's layers panel
 */
export type DesignToolNode = RehypeNode & {
  isSelected?: boolean;
  fileName?: string;
  element?: HTMLElement;
};

/**
 * Custom Rehype Parser types as rehype's are lacking
 */
export type RehypeNode = {
  type: 'element' | 'text' | 'comment';
  tagName: string;
  properties?: {
    className?: string[];
  };
  children?: RehypeNode[];
  value?: string; // TODO: Only have value if `text` type
  // TODO: This should be all required, but it causes probs in DesignToolsNode. Should try and override in DesignToolsNode
  position?: {
    start?: { line?: number; column?: number; offset?: number };
    end?: { line?: number; column?: number; offset?: number };
  };
};

// Used in RehypeComponent, but getting funny errors if used in parseCode and getSelectedNode
export type RehypeRootNode = {
  type: 'root';
  children?: RehypeNode[];
};
