import { useEffect, useState } from 'react';

/**
 * Skip hydration errors with this hook
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
