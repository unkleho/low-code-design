import { LibraryPanel } from './LibraryPanel';

type Props = {
  className?: string;
};

export const CodesignRightSidebar = ({ className }: Props) => {
  return (
    <aside className={[className || ''].join(' ')}>
      <LibraryPanel></LibraryPanel>
    </aside>
  );
};
