import { processClassName } from '../components/DesignToolsApp';

describe('Process Class Name', () => {
  it('should replace w-8 only', () => {
    const newClassName = processClassName('min-w-8 w-8 flex', 'w-8', 'w-6');

    expect(newClassName).toEqual('min-w-8 w-6 flex');
  });

  it('should append w-8', () => {
    const newClassName = processClassName('min-w-8 flex', '', 'w-8');

    expect(newClassName).toEqual('min-w-8 flex w-8');
  });
});
