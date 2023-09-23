import classNameValues from '../class-name/class-name-values';
import { textColors } from '../tailwind-config';
import { FormState } from './store';

const baseColors = Object.keys(textColors).map((key) => key);

/**
 * Convert a className string to populate Codesign form values
 */
export function buildFormValues(className: string): FormState {
  return {
    className,
    // Layout
    position: className.split(' ').find((value) => {
      return classNameValues.position.includes(value);
    }),
    display: className.split(' ').find((value) => {
      return classNameValues.display.includes(value);
    }),
    flexDirection: getClassNameValue(className, 'flex-'),
    // Sizing
    width: getClassNameValue(className, 'w-'),
    minWidth: getClassNameValue(className, 'min-w-'),
    height: getClassNameValue(className, 'h-'),
    minHeight: getClassNameValue(className, 'min-h-'),
    // Spacing
    marginTop:
      getClassNameValue(className, 'mt-') || getClassNameValue(className, 'm-'),
    marginRight:
      getClassNameValue(className, 'mr-') || getClassNameValue(className, 'm-'),
    marginBottom:
      getClassNameValue(className, 'mb-') || getClassNameValue(className, 'm-'),
    marginLeft:
      getClassNameValue(className, 'ml-') || getClassNameValue(className, 'm-'),
    paddingTop:
      getClassNameValue(className, 'pt-') || getClassNameValue(className, 'p-'),
    paddingRight:
      getClassNameValue(className, 'pr-') || getClassNameValue(className, 'p-'),
    paddingBottom:
      getClassNameValue(className, 'pb-') || getClassNameValue(className, 'p-'),
    paddingLeft:
      getClassNameValue(className, 'pl-') || getClassNameValue(className, 'p-'),
    // Typography
    fontSize: getClassNameValue(className, 'text-'),
    fontWeight: getClassNameValue(className, 'font-'),
    textColor: getPrefixColorValue(className, 'text-'),
    textTransform: className.split(' ').find((value) => {
      return classNameValues.textTransform.includes(value);
    }),
    leading: getClassNameValue(className, 'leading-'),
    // Background
    backgroundColor: getClassNameValue(className, 'bg-'),
    // Effect
    opacity: getClassNameValue(className, 'opacity-'),
  };
}

function getClassNameValue(className = '', prefix: string) {
  return className
    .split(' ')
    .filter((c) => {
      return c.includes(prefix);
    })[0]
    ?.replace(prefix, '');
}

function getPrefixColorValue(className = '', prefix: string) {
  let textColorValue;

  for (const baseColor of baseColors) {
    // Most colors have shades, eg. grey-100, grey-200.
    // However black and white do not, so there needs to be different logic to
    // handle these cases.
    const hasShades = Boolean(
      textColors[baseColor] && textColors[baseColor].length > 0,
    );

    if (hasShades) {
      const colorValue = getClassNameValue(
        className,
        `${prefix}${baseColor}${hasShades ? '-' : ''}`,
      );

      if (colorValue) {
        textColorValue = `${baseColor}-${colorValue}`;
        break;
      }
    } else {
      // white and black don't have shades, so color value is same as baseColor
      const hasColorValue = className.includes(`${prefix}${baseColor}`);

      if (hasColorValue) {
        textColorValue = baseColor;
      }
    }
  }

  return textColorValue;
}
