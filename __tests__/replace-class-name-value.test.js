import replaceClassNameValue from '../lib/replace-class-name-value';

describe('Process Class Name', () => {
  it('should replace w-8 only', () => {
    const newClassName = replaceClassNameValue(
      'min-w-8 w-8 flex',
      'w-8',
      'w-6'
    );

    expect(newClassName).toEqual('min-w-8 w-6 flex');
  });

  it('should append w-8', () => {
    const newClassName = replaceClassNameValue('min-w-8 flex', '', 'w-8');

    expect(newClassName).toEqual('min-w-8 flex w-8');
  });

  // TODO:
  // it('should append -mt-2', () => {
  //   const newClassName = replaceClassNameValue('min-w-8 flex', '', '-mt-2');

  //   expect(newClassName).toEqual('min-w-8 flex w-8 -mt-2');
  // });
});
