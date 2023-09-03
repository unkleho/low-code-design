import * as React from "react";

export interface FiberNodeDOMContainer extends Element {
  _reactRootContainer: {
    _internalRoot: {
      current: FiberNode | null;
    };
  };
}

export type FiberNode =
  | FiberNodeForComponentClass
  | FiberNodeForFunctionComponent
  | FiberNodeForInstrinsicElement
  | FiberNodeForTextNode;

export interface FiberNodeForFunctionComponent {
  child: FiberNode | null;
  sibling: FiberNode | null;

  elementType: React.FunctionComponent;
  type: React.FunctionComponent;

  stateNode: null;
}

export interface FiberNodeForComponentClass {
  child: FiberNode | null;
  sibling: FiberNode | null;

  elementType: React.ComponentClass;
  type: React.ComponentClass;

  stateNode: React.Component;
}

export interface FiberNodeForInstrinsicElement {
  child: FiberNode | null;
  sibling: FiberNode | null;

  elementType: keyof JSX.IntrinsicElements;
  type: keyof JSX.IntrinsicElements;

  stateNode: HTMLElement;
}

export interface FiberNodeForTextNode {
  child: null;
  sibling: FiberNode | null;

  elementType: null;
  type: null;

  stateNode: Text;
}

export type FiberNodeisHTMLLike =
  | FiberNodeForInstrinsicElement
  | FiberNodeForTextNode;
