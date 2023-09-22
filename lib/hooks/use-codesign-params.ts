import { useParams } from 'next/navigation';

export const useCodesignParams = () => {
  return useParams() as { componentId?: string };
};
