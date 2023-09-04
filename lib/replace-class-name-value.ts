/**
 * Append or replace a newValue in a className string
 */
export default function replaceClassNameValue(
  className: string,
  oldValue: string,
  newValue: string,
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

// TODO: What if there is no prefix? eg. display
// TODO: Handle negative values
// TODO: Write tests
export function updateClassName(
  className: string,
  prefix: string,
  value: string,
) {
  console.log(
    'updateClassName:',
    className,
    'prefix:',
    prefix,
    'value:',
    value,
  );

  // eg. `mt`, `pb`
  // const prefix = value.split('-')?.[0];

  if (!prefix) {
    return className;
  }

  const classes = className.split(' ');
  let updated = false;

  const newClasses = classes
    .filter((c) => {
      // Filter out class if there is no value
      if (!value && c.startsWith(prefix)) {
        console.log('updateClassName filter', c);

        updated = true;
        return false;
      }

      return true;
    })
    .map((c) => {
      if (c.startsWith(prefix)) {
        console.log('updateClassName startsWith', c);

        updated = true;
        return `${prefix}-${value}`;
      }

      return c;
    });

  if (!updated) {
    newClasses.push(`${prefix}-${value}`);
  }

  console.log('updateClassName result', newClasses.join(' '));

  return newClasses.join(' ').trim();
}
