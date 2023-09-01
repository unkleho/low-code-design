export function getPathIndexes(
  element: HTMLElement,
  rootId = '__codesign',
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
