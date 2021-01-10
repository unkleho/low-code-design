import { FiberNode as FiberNodeBase } from 'react-fiber-traverse/dist/mocked-types';

/**
 * Node type to build elements in design tool's layers panel
 */
export type DesignToolNode = RehypeNode & {
  isSelected?: boolean;
  fileName?: string;
  element?: HTMLElement;
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
      type: 'UPDATE_NODE_CLASS_NAME';
      node: DesignToolNode;
      className: string;
      element?: HTMLElement;
    }
  | {
      type: 'UPDATE_NODE_TEXT';
      node: DesignToolNode;
      text: string;
      element?: HTMLElement;
    }
  | {
      type: 'CREATE_NODE';
      node: DesignToolNode;
      elementType: string;
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
