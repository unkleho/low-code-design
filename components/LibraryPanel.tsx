import Link from 'next/link';
import { components } from '../lib/data';
import { useCodesignStore } from '../lib/store/store';
import Panel from './Panel';
import { useCodesignParams } from '../lib/hooks/use-codesign-params';

/**
 * A list of components, templates and other assets
 */
export const LibraryPanel = () => {
  // const {} = useCodesignStore();
  const { componentId } = useCodesignParams();

  return (
    <Panel name="library" title="Library">
      <ul className="text-sm">
        {components.map((component) => {
          const isSelected = component.id === componentId;

          return (
            <li className="" key={component.id}>
              <Link
                href={`/editor/${component.id}`}
                className={[
                  'block px-4 py-2 text-xs',
                  'hover:bg-blue-100',
                  isSelected ? 'font-semibold' : '',
                ].join(' ')}
              >
                {component.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
};
