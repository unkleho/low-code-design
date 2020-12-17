let { useState, useEffect, useMemo } = require("react");

const defaultCallback = (mutationList) => mutationList;

function useMutationObserver(
  targetNode: Node,
  config: MutationObserverInit,
  callback = defaultCallback
) {
  if (typeof window === "undefined") {
    return null;
  }

  const [value, setValue] = useState(undefined);
  const observer: MutationObserver = useMemo(
    () =>
      new MutationObserver((mutationList, observer) => {
        const result = callback(mutationList, observer);
        setValue(result);
      }),
    [callback]
  );

  useEffect(() => {
    if (targetNode) {
      observer.observe(targetNode, config);
      return () => {
        observer.disconnect();
      };
    }
  }, [targetNode, config]);

  return value;
}

export default useMutationObserver;
