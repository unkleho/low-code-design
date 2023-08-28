import { FiberNode, FiberNodeWithId } from '../types';

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

/**
 * Build a unique ID for Fiber Node by going up the parent chain towards the root element
 */
export function getFiberNodeId(node: FiberNode, rootId = '__codesign') {
  function getIndexes(node: FiberNode, indexes = []) {
    if (node.stateNode?.id === rootId) {
      return indexes;
    }

    indexes.push(node.index);

    return getIndexes(node.return, indexes);
  }

  const indexes = getIndexes(node);

  return indexes.reverse().join('-');
}

export function getChildNodes(node: FiberNode): FiberNodeWithId[] {
  // console.log('nodeTree childNodes', node);

  const child = node?.child;

  if (!child) {
    return [];
  }

  const siblings = getSiblings(child);

  if (siblings.length === 0) {
    return [child].map((n) => {
      return {
        ...n,
        id: getFiberNodeId(n),
      };
    });
  }

  return [child, ...siblings].map((n) => {
    return {
      ...n,
      id: getFiberNodeId(n),
    };
  });
}

export function getSiblings(node: FiberNode, siblings = []): FiberNode[] {
  const sibling = node.sibling;

  if (sibling) {
    siblings.push(sibling);

    return getSiblings(sibling, siblings);
  }

  return siblings;
}

// /**
//  * Work out the Nth sibling of current node
//  */
// export function getSiblingIndex(node: FiberNode): number {
//   const children = getChildNodes(node.return);
//   const index = children.findIndex((child) => child === node);
//   console.log('getSiblingIndex', node, children, index);

//   return index;
// }
