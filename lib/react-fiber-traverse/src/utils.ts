import * as React from 'react';
import {
  FiberNode,
  FiberNodeisHTMLLike,
  FiberNodeForFunctionComponent,
  FiberNodeForComponentClass,
  FiberNodeDOMContainer,
} from './mocked-types';

// Support null in all of these
function isNodeHtmlLike(node: FiberNode): node is FiberNodeisHTMLLike {
  return typeof node.type === 'string' || node.type === null;
}

function isNodeNotHtmlLike(
  node: FiberNode,
): node is Exclude<FiberNode, FiberNodeisHTMLLike> {
  return !isNodeHtmlLike(node);
}

function isNodeFunctionComponent(
  node: FiberNode,
): node is FiberNodeForFunctionComponent {
  return isNodeNotHtmlLike(node) && node.stateNode === null;
}

function isNodeComponentClass(
  node: FiberNode,
): node is FiberNodeForComponentClass {
  return isNodeNotHtmlLike(node) && node.stateNode instanceof React.Component;
}

function isConstructorHtmlLike(
  ctr: React.ElementType | null,
): ctr is Exclude<React.ElementType | null, React.ComponentType> {
  if (typeof ctr === 'string' || ctr === null) {
    return true;
  }
  return false;
}

function isConstructorComponentClass(
  ctr: React.ElementType | null,
): ctr is React.ComponentClass {
  if (isConstructorHtmlLike(ctr)) {
    return false;
  }

  if (
    ctr.prototype !== undefined &&
    (ctr.prototype as any) instanceof React.Component
  ) {
    return true;
  }

  return false;
}

function isConstructorFunctionComponent(
  ctr: React.ElementType | null,
): ctr is React.FunctionComponent {
  return typeof ctr === 'function' && !isConstructorComponentClass(ctr);
}

function doesElementContainRootFiberNode(
  element: Element,
): element is FiberNodeDOMContainer {
  console.log('doesElementContainRootFiberNode', element);

  let rootKey;
  for (const key of Object.keys(element)) {
    if (key.startsWith('__reactContainer$')) {
      rootKey = key;
    }
  }

  return Boolean(rootKey);

  // return (
  //   element.hasOwnProperty('_reactRootContainer') &&
  //   (element as Element & {
  //     _reactRootContainer: any;
  //   })._reactRootContainer.hasOwnProperty('_internalRoot')
  // );
}

/**
 * Util to find root React Fiber node from html DOM tree.
 * Returns null, if not found.SHould be called after ReactDOM.render is finished.
 * @param startElement Starting DOM element to seach from.
 * If not found, it checks inside its child nodes. Defaults to document.body
 */
function getRootFiberNodeFromDOM(startElement?: Element): FiberNode | null {
  console.log('getRootFiberNodeFromDOM()', startElement);
  if (startElement === undefined) {
    startElement = document.body;
  }

  if (doesElementContainRootFiberNode(startElement)) {
    return startElement?._reactRootContainer?._internalRoot?.current;
  }

  let returnFiberNode = null;
  for (const childNode of [].slice.call(startElement.children)) {
    console.log('getRootFiberNodeFromDOM childNode', childNode);

    returnFiberNode = getRootFiberNodeFromDOM(childNode);
    if (returnFiberNode !== null) {
      return returnFiberNode;
    }
  }

  return returnFiberNode;
}

export {
  isNodeHtmlLike,
  isNodeNotHtmlLike,
  isNodeFunctionComponent,
  isNodeComponentClass,
  isConstructorHtmlLike,
  isConstructorComponentClass,
  isConstructorFunctionComponent,
  doesElementContainRootFiberNode,
  getRootFiberNodeFromDOM,
};
