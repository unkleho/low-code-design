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
export function updateClassName(
  className: string,
  prefix: string,
  value: string,
) {
  // console.log(
  //   'updateClassName:',
  //   className,
  //   'prefix:',
  //   prefix,
  //   'value:',
  //   value,
  // );

  const isNegative = value?.startsWith('-');
  const newValue = isNegative ? value.substring(1) : value;

  if (!prefix) {
    return className;
  }

  const classes = className.split(' ');
  let updated = false;

  const newClasses = classes
    .filter((c) => {
      // Filter out class if there is no value
      if (c.startsWith(prefix) || c.startsWith(`-${prefix}`)) {
        if (!value) {
          // console.log('updateClassName filter value', c, prefix, value);

          updated = true;
          return false;
        }

        return true;
      }

      return true;
    })
    .map((c) => {
      // Update value
      if (c.startsWith(prefix) || c.startsWith(`-${prefix}`)) {
        // console.log('updateClassName startsWith', c);

        updated = true;

        if (isNegative) {
          return `-${prefix}-${newValue}`;
        }

        return `${prefix}-${newValue}`;
      }

      return c;
    });

  // Value not in class names, so just push to end
  if (newValue && !updated) {
    newClasses.push(`${isNegative ? '-' : ''}${prefix}-${newValue}`);
  }

  // console.log('updateClassName result', newClasses.join(' '));

  return newClasses.join(' ').trim();
}
