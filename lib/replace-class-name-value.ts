/**
 * Append or replace a newValue in a className string
 */
export default function replaceClassNameValue(
  className: string,
  oldValue: string,
  newValue: string
): string {
  let newClassName;

  if (oldValue) {
    newClassName = className
      .split(' ')
      .map((c) => {
        if (c === oldValue) {
          return newValue;
        }

        return c;
      })
      .join(' ');
  } else {
    newClassName = `${className}${newValue ? ` ${newValue}` : ''}`;
  }

  return newClassName.trim();
}
