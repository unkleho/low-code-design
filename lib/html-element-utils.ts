export const CODESIGN_ROOT_ID = '__codesign';

export function getPathIndexes(
  element: HTMLElement,
  rootId = CODESIGN_ROOT_ID,
): number[] {
  if (!element) {
    return [];
  }

  function getIndex(element: HTMLElement, indexes = []) {
    if (element.id === rootId || element.tagName === 'BODY') {
      return indexes;
    }

    const index = [...element.parentElement.children].indexOf(element);

    indexes.unshift(index);

    return getIndex(element.parentElement, indexes);
  }

  return getIndex(element);
}

export function getSelectedElement(
  rootElement: HTMLElement,
  pathIndexes: number[] = [],
) {
  const result = pathIndexes.reduce((prev, index) => {
    return prev.children[index];
  }, rootElement);

  return result;
}

export const changeHighlightElement = (
  previewElement: HTMLElement,
  highlightElement: HTMLElement,
  pathIndexes = [],
) => {
  if (!highlightElement) {
    return;
  }

  if (pathIndexes.length === 0) {
    highlightElement.style.outline = null;
    return null;
  }

  const element = getSelectedElement(previewElement, pathIndexes);

  if (element) {
    const { top, left, width, height } = element.getBoundingClientRect();

    updateHighlightElement(highlightElement, {
      top,
      left,
      width,
      height,
    });
  }
};

function updateHighlightElement(element, { top, left, width, height }) {
  if (element) {
    // Had to go vanilla JS, tried my hardest with useState and useRef, but it either caused infinite loop or didn't work.
    element.style.outline = `1px solid cyan`;
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.pointerEvents = `none`;
  }
}
