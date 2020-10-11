import React from 'react';

import replaceClassNameValue from '../replace-class-name-value';
import classNameValues from '../class-name-values';
import { textColors } from '../tailwind-config';

const DesignToolsContext = React.createContext([]);

export const types = {
  UPDATE_CLASS_NAME: 'UPDATE_CLASS_NAME',
  UPDATE_TEXT: 'UPDATE_TEXT',
  UPDATE_CURRENT_FIELD: 'UPDATE_CURRENT_FIELD',
  UPDATE_FORM_VALUE: 'UPDATE_FORM_VALUE',
  UPDATE_SELECTED_NODE: 'UPDATE_SELECTED_NODE',
  TOGGLE_PANEL_STATUS: 'TOGGLE_PANEL_STATUS',
  REFRESH_LAYERS_PANEL: 'REFRESH_LAYERS_PANEL',
};

function designToolsReducer(state, action) {
  console.log(action);

  switch (action.type) {
    case types.UPDATE_CURRENT_FIELD: {
      return {
        ...state,
        currentField: action.currentField,
      };
    }

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
        ...buildFormValues(action.className),
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

      return {
        ...state,
        selectedNode: action.selectedNode,
        text: typeof children === 'string' ? children : '',
      };
    }

    case types.TOGGLE_PANEL_STATUS: {
      return {
        ...state,
        panels: state.panels.map((panel) => {
          if (panel.name === action.panelName) {
            return {
              ...panel,
              status: panel.status === 'open' ? 'closed' : 'open',
            };
          }

          return panel;
        }),
      };
    }

    case types.REFRESH_LAYERS_PANEL: {
      return {
        ...state,
        layersPanelKey: state.layersPanelKey + 1,
      };
    }

    default: {
      throw new Error(`Unsupported action type: ${action.type}`);
    }
  }
}

export function DesignToolsProvider(props) {
  const [state, dispatch] = React.useReducer(designToolsReducer, {
    currentField: null,
    selectedNode: null,
    layersPanelKey: 0,
    // WIP
    text: null,
    ...defaultFormValues,
    form: defaultFormValues,
    panels: [
      {
        name: 'element',
        status: 'open',
      },
      {
        name: 'layout',
        status: 'open',
      },
      {
        name: 'spacing',
        status: 'open',
      },
      {
        name: 'sizing',
        status: 'open',
      },
      {
        name: 'typography',
        status: 'open',
      },
      {
        name: 'background',
        status: 'open',
      },
      {
        name: 'layers',
        status: 'open',
      },
    ],
  });
  const value = React.useMemo(() => [state, dispatch], [state]);

  return <DesignToolsContext.Provider value={value} {...props} />;
}

export function useDesignTools() {
  const context = React.useContext(DesignToolsContext);

  if (!context) {
    throw new Error(`useDesignTools must be used within a DesignToolsProvider`);
  }

  const [state, dispatch] = context;

  const updateCurrentField = (currentField) =>
    dispatch({ type: types.UPDATE_CURRENT_FIELD, currentField });

  const updateClassNameValue = (oldValue, newValue) => {
    const className = replaceClassNameValue(
      state.className,
      oldValue,
      newValue
    );

    dispatch({ type: types.UPDATE_CLASS_NAME, className });
  };

  const togglePanelStatus = (panelName) => {
    dispatch({
      type: types.TOGGLE_PANEL_STATUS,
      panelName,
    });
  };

  return {
    state,
    dispatch,
    updateCurrentField,
    updateClassNameValue,
    togglePanelStatus,
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
  };
}

const baseColors = Object.keys(textColors).map((key) => key);

function getPrefixColorValue(className = '', prefix) {
  let textColorValue;

  for (const baseColor of baseColors) {
    const colorValue = getClassNameValue(className, `${prefix}${baseColor}-`);

    if (colorValue) {
      textColorValue = `${baseColor}-${colorValue}`;
      break;
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
