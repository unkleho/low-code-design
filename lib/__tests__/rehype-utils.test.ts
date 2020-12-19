import { updateNodeClass } from '../rehype-utils';

const code = `<div>
  <section></section>
  <section>
    <div>
      <p></p>
      <p id="selected">Hello</p>
    </div>
  </section>
</div>`;
const codeWithClass = `<div>
  <section></section>
  <section>
    <div>
      <p></p>
      <p id="selected" class="font-2xl">Hello</p>
    </div>
  </section>
</div>`;
const ancestorIndexes = [0, 1, 0, 1];

describe('Rehype', () => {
  it('should select element in code and add class', () => {
    const newCode = updateNodeClass(code, ancestorIndexes, 'font-2xl');

    expect(newCode).toEqual(codeWithClass);
  });

  it('should select element in code and remove class', () => {
    const newCode = updateNodeClass(codeWithClass, ancestorIndexes, null);

    expect(newCode).toEqual(code);
  });
});
