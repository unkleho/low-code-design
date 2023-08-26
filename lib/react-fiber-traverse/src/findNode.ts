import { FiberNode } from "./mocked-types";
import { traverseGenerator, TTraverseConfig } from "./traverse";
import { isNodeNotHtmlLike } from "./utils";

/**
 * Find node by component name, till first match.
 *
 * Matches against class and function name, doesn't match html-like nodes.
 * Returns null if no match is found.
 *
 * @example
 * ```js
 * // returns FiberNode for first usage of 'AccordionMenu'
 * findNodeByComponentName(startNode, "AccordionMenu");
 * ```
 *
 * @note Highest chance of collision, least data access needed.
 * Different components with same name will collide.
 * Needs access to component name.
 *
 */
function findNodeByComponentName(
  node: FiberNode | null,
  expectedName: string,
  traverseConfig?: TTraverseConfig
): FiberNode | null {
  if (node === null) {
    return null;
  }

  const nodeIterator = traverseGenerator(node, traverseConfig);
  for (const tmpNode of nodeIterator) {
    if (isNodeNotHtmlLike(tmpNode) && tmpNode.type.name === expectedName) {
      return tmpNode;
    }
  }

  return null;
}

function* findNodesByComponentName(
  node: FiberNode | null,
  expectedName: string,
  traverseConfig?: TTraverseConfig
): IterableIterator<FiberNode> {
  if (node === null) {
    return null;
  }

  const nodeIterator = traverseGenerator(node, traverseConfig);
  for (const tmpNode of nodeIterator) {
    if (isNodeNotHtmlLike(tmpNode) && tmpNode.type.name === expectedName) {
      yield tmpNode;
    }
  }
}

function findAllNodesByComponentName(
  node: FiberNode | null,
  expectedName: string,
  traverseConfig?: TTraverseConfig
): Array<FiberNode> {
  return [...findNodesByComponentName(node, expectedName, traverseConfig)];
}

/**
 * Find node by component (i.e. class or function by reference), till first match.
 *
 * Matches against class and function by reference.
 * Returns null if no match is found.
 *
 * @example
 * ```js
 * // returns FiberNode for first usage of AccordionMenu
 * findNodeByComponent(startNode, AccordionMenu);
 * ```
 *
 * @note Medium chance of collision, medium data access needed.
 * This is safer than findNodeByComponentName, as different components with the same name won't collide.
 * But, two instances of the same component will still collide.
 * Needs access to component class or function.
 *
 */
function findNodeByComponent(
  node: FiberNode | null,
  expectedClassOrFunction: React.ComponentType,
  traverseConfig?: TTraverseConfig
): FiberNode | null {
  if (node === null) {
    return null;
  }

  const nodeIterator = traverseGenerator(node, traverseConfig);
  for (const tmpNode of nodeIterator) {
    if (
      isNodeNotHtmlLike(tmpNode) &&
      tmpNode.type === expectedClassOrFunction
    ) {
      return tmpNode;
    }
  }

  return null;
}

/**
 * Find node by component instance ref, till first match.
 *
 * Matches against class instances by reference.
 * Returns null if no match is found.
 *
 * @example
 * ```js
 * // menuRef=createRef(); <AccordionMenu ref={menuRef}>
 * findNodeByComponentRef(startNode, menuRef.current);
 * ```
 *
 * @note  Least chance of collision, maximum data access needed.
 * Needs access to component instance (through React ref usually).
 *
 */
function findNodeByComponentRef(
  node: FiberNode | null,
  expectedClassInstance: React.Component,
  traverseConfig?: TTraverseConfig
): FiberNode | null {
  if (node === null) {
    return null;
  }

  const nodeIterator = traverseGenerator(node, traverseConfig);
  for (const tmpNode of nodeIterator) {
    if (
      isNodeNotHtmlLike(tmpNode) &&
      tmpNode.stateNode === expectedClassInstance
    ) {
      return tmpNode;
    }
  }

  return null;
}

export {
  findNodeByComponentName,
  findNodesByComponentName,
  findAllNodesByComponentName,
  findNodeByComponent,
  findNodeByComponentRef
};
