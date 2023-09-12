import React from 'react';

import replaceClassNameValue from '../replace-class-name-value';
import classNameValues from '../class-name-values';
import { textColors } from '../tailwind-config';

const CodesignContext = React.createContext([]);

export const types = {
  UPDATE_CLASS_NAME: 'UPDATE_CLASS_NAME',
  UPDATE_TEXT: 'UPDATE_TEXT',
  UPDATE_FORM_VALUE: 'UPDATE_FORM_VALUE',
  UPDATE_SELECTED_NODE: 'UPDATE_SELECTED_NODE',
  REFRESH_LAYERS_PANEL: 'REFRESH_LAYERS_PANEL',
};

// TODO: pathIndexes? selectedElement?
type AppState = {
  text: string;
  form: FormState;
  layersPanelKey: number;
  layersPanelRefreshCounter?: number;
};

type FormState = {
  className: string;
  // Layout
  position: string;
  display: string;
  flexDirection: string;
  // Sizing
  width: string;
  minWidth: string;
  height: string;
  minHeight: string;
  // Spacing
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  // Typography
  fontSize: string;
  fontWeight: string;
  textColor: string;
  textTransform: string;
  leading: string;
  // Background
  backgroundColor: string;
  // Effect
  opacity: string;
};

function CodesignReducer(state: AppState, action) {
  console.log('CodesignReducer', action);

  switch (action.type) {
    case types.UPDATE_FORM_VALUE: {
      return {
        ...state,
        form: {
          ...state.form,
          [action.key]: action.value,
        },
      };
    }

    case types.UPDATE_CLASS_NAME: {
      return {
        ...state,
        // ...buildFormValues(action.className),
        // Experiment with keeping form state in context
        // Will need to access it from handleSubmit, so might as well keep it handy
        // Could cause perf issues, but whatevs for now
        form: buildFormValues(action.className),
      };
    }

    case types.UPDATE_TEXT: {
      return {
        ...state,
        text: action.text,
      };
    }

    case types.UPDATE_SELECTED_NODE: {
      const children = action.selectedNode?.pendingProps?.children;

      let text;
      if (typeof children === 'string') {
        text = children;
      } else if (children?.props?.type === 'text') {
        // Need this for RehypeComponent
        text = children.props.value;
      }

      console.log(
        'types.UPDATE_SELECTED_NODE',
        children?.props?.type,
        children?.props?.value,
      );

      return {
        ...state,
        selectedNode: action.selectedNode,
        // text: typeof children === 'string' ? children : '',
        text,
      };
    }

    case types.REFRESH_LAYERS_PANEL: {
      return {
        ...state,
        layersPanelRefreshCounter: state.layersPanelRefreshCounter + 1,
      };
    }

    default: {
      throw new Error(`Unsupported action type: ${action.type}`);
    }
  }
}

export function CodesignProvider(props) {
  const [state, dispatch] = React.useReducer(CodesignReducer, {
    selectedNode: null,
    layersPanelKey: 0,
    text: null,
    form: defaultFormValues,
  });
  const value = React.useMemo(() => [state, dispatch], [state]);

  return <CodesignContext.Provider value={value} {...props} />;
}

export function useCodesign() {
  const context = React.useContext(CodesignContext);

  if (!context) {
    throw new Error(`useCodesign must be used within a CodesignProvider`);
  }

  const [state, dispatch] = context;

  const updateClassNameValue = (oldValue, newValue) => {
    const className = replaceClassNameValue(
      state.form.className,
      oldValue,
      newValue,
    );

    console.log(
      'updateClassNameValue',
      state.form.className,
      className,
      oldValue,
      newValue,
    );

    dispatch({ type: types.UPDATE_CLASS_NAME, className });
  };

  return {
    state,
    dispatch,
    updateClassNameValue,
  };
}

const defaultFormValues = {
  className: '',
  // Layout
  position: '',
  display: '',
  flexDirection: '',
  // Sizing
  width: '',
  minWidth: '',
  height: '',
  minHeight: '',
  // Spacing
  marginTop: '',
  marginRight: '',
  marginBottom: '',
  marginLeft: '',
  paddingTop: '',
  paddingRight: '',
  paddingBottom: '',
  paddingLeft: '',
  // Typography
  fontSize: '',
  fontWeight: '',
  textColor: '',
  textTransform: '',
  leading: '',
  // Background
  backgroundColor: '',
  // Effect
  opacity: '',
};

function buildFormValues(className) {
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

const baseColors = Object.keys(textColors).map((key) => key);

function getPrefixColorValue(className = '', prefix) {
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

function getClassNameValue(className = '', prefix) {
  return className
    .split(' ')
    .filter((c) => {
      return c.includes(prefix);
    })[0]
    ?.replace(prefix, '');
}
