import { updateClassName } from './replace-class-name-value';

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
});
