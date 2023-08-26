import * as CSSWhat from 'css-what';
import { traverseGenerator } from './traverse';
import { FiberNode } from './mocked-types';
import { isNodeNotHtmlLike } from './utils';

function* matchGenerator(
  node: FiberNode,
  match: string | CSSWhat.Selector[][],
): IterableIterator<FiberNode> {
  // Either parse match string or allow parsed match object as it is
  let matchParsed: CSSWhat.Selector[][];
  if (typeof match === 'string') {
    matchParsed = CSSWhat.parse(match, {
      lowerCaseTags: false,
      lowerCaseAttributeNames: false,
    });
  } else {
    matchParsed = match;
  }
  // If selector is a combination of multiple basic selectors (a, b),
  // pass them separately to matchGenerator and combine their results one after another
  const selectorsCount = matchParsed.length;
  if (selectorsCount > 1) {
    for (const selectorParsed of matchParsed) {
      yield* matchGenerator(node, [selectorParsed]);
    }

    return;
  }

  // For simple selector (matchParsed.length == 0), actual logic starts here
  {
    const parsedSelector = matchParsed[0];
    if (parsedSelector.length === 0) {
      return;
    }

    let currentMatchingNodes: FiberNode[] = [node];
    let currentMatchingSelectorPartIndex = 0;
    let lastRelationshipSelectorPart: CSSWhat.Selector | undefined = undefined;

    while (currentMatchingSelectorPartIndex < parsedSelector.length) {
      const nextMatchingNodes: FiberNode[] = [];

      for (const currentNode of currentMatchingNodes) {
        const currentMatchingSelectorPart: CSSWhat.Selector =
          parsedSelector[currentMatchingSelectorPartIndex];
        if (['tag'].includes(currentMatchingSelectorPart.type)) {
          const startParams = {
            skipSelfForStartNode: true,
            skipSiblingForStartNode: true,
          };

          let nextParams: {
            skipChild?: boolean;
            skipSibling?: boolean;
          } = {};
          if (
            lastRelationshipSelectorPart === undefined ||
            lastRelationshipSelectorPart.type === 'descendant'
          ) {
            nextParams = { skipChild: false, skipSibling: false };
          } else if (lastRelationshipSelectorPart.type === 'child') {
            // visit only first level of child
            nextParams = { skipChild: true };
          } else if (lastRelationshipSelectorPart.type === 'sibling') {
            // visit only siblings of start node
            nextParams = { skipChild: true, skipSibling: true };
            startParams.skipSiblingForStartNode = false;
          }

          const traverseIterator = traverseGenerator(currentNode, startParams);

          // Handle supported non-traversal parts here
          if (currentMatchingSelectorPart.type == 'tag') {
            let tmpNode: FiberNode;
            while (
              // @ts-ignore
              !({ value: tmpNode } = traverseIterator.next(nextParams)).done
            ) {
              if (
                isNodeNotHtmlLike(tmpNode) &&
                tmpNode.type.name === currentMatchingSelectorPart.name
              ) {
                nextMatchingNodes.push(tmpNode);
              }
            }
          }
          // traverseIterator.throw &&
          //   traverseIterator.throw(new Error("cleanup"));
        } else if (
          ['descendant', 'child'].includes(currentMatchingSelectorPart.type)
        ) {
          // Handle traversal parts here - Save for look back in next part
          lastRelationshipSelectorPart = currentMatchingSelectorPart;
          // Preserve currentMatchingNodes
          nextMatchingNodes.push(...currentMatchingNodes);
        } else {
          // For unhandled parts
          lastRelationshipSelectorPart = undefined;
        }
      }

      currentMatchingNodes = nextMatchingNodes;
      currentMatchingSelectorPartIndex += 1;
    }

    for (const tmpNode of currentMatchingNodes) {
      yield tmpNode;
    }

    return;
  }
}

function matchAll(
  node: FiberNode,
  match: string | CSSWhat.Selector[][],
): Array<FiberNode> {
  return [...matchGenerator(node, match)];
}

function matchFirst(
  node: FiberNode,
  match: string | CSSWhat.Selector[][],
): FiberNode | null {
  const matchIterator = matchGenerator(node, match);
  const firstResult = matchIterator.next();

  // Cancel generator
  matchIterator.throw && matchIterator.throw(new Error('Cleanup'));

  // If match found, return that
  if (!firstResult.done) {
    return firstResult.value;
  }

  // Else return null
  return null;
}

export { matchGenerator, matchAll, matchFirst };
