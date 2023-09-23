import { updateClassName } from './class-name-utils';

describe('Class name value', () => {
  it('should change margin to 2', () => {
    const result = updateClassName('block m-1', 'm', '2');

    expect(result).toEqual('block m-2');
  });

  it('should change margin to -2', () => {
    const result = updateClassName('block m-1', 'm', '-2');

    expect(result).toEqual('block -m-2');
  });

  it('should change negative margin to 2', () => {
    const result = updateClassName('block -m-1', 'm', '2');

    expect(result).toEqual('block m-2');
  });

  it('should change negative margin to -2', () => {
    const result = updateClassName('block -m-1', 'm', '-2');

    expect(result).toEqual('block -m-2');
  });

  it('should not change class name', () => {
    const result = updateClassName('block', 'm', undefined);

    expect(result).toEqual('block');
  });

  it('should ignore responsive prefixes', () => {
    const result = updateClassName('block sm:m-2 m-1', 'm', '4');

    expect(result).toEqual('block sm:m-2 m-4');
  });
});
