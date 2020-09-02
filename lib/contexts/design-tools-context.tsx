import React from 'react';

const DesignToolsContext = React.createContext([]);

function getClassNameValue(className = '', prefix) {
  return className
    .split(' ')
    .filter((c) => {
      return c.includes(prefix);
    })[0]
    ?.replace(prefix, '');
}

export const types = {
  UPDATE_CLASS_NAME: 'UPDATE_CLASS_NAME',
  UPDATE_CURRENT_FIELD: 'UPDATE_CURRENT_FIELD',
  UPDATE_FORM_VALUE: 'UPDATE_FORM_VALUE',
};

function designToolsReducer(state, action) {
  console.log(state, action);

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
        className: action.className,
        position: action.className.split(' ').find((c) => {
          return ['relative', 'absolute', 'sticky'].includes(c);
        }),
        display: action.className.split(' ').find((c) => {
          return ['block', 'flex', 'grid'].includes(c);
        }),
        width: getClassNameValue(action.className, 'w-'),
        minWidth: getClassNameValue(action.className, 'min-w-'),
        height: getClassNameValue(action.className, 'h-'),
        marginTop:
          getClassNameValue(action.className, 'mt-') ||
          getClassNameValue(action.className, 'm-'),
        marginRight:
          getClassNameValue(action.className, 'mr-') ||
          getClassNameValue(action.className, 'm-'),
        marginBottom:
          getClassNameValue(action.className, 'mb-') ||
          getClassNameValue(action.className, 'm-'),
        marginLeft:
          getClassNameValue(action.className, 'ml-') ||
          getClassNameValue(action.className, 'm-'),
        paddingTop:
          getClassNameValue(action.className, 'pt-') ||
          getClassNameValue(action.className, 'p-'),
        paddingRight:
          getClassNameValue(action.className, 'pr-') ||
          getClassNameValue(action.className, 'p-'),
        paddingBottom:
          getClassNameValue(action.className, 'pb-') ||
          getClassNameValue(action.className, 'p-'),
        paddingLeft:
          getClassNameValue(action.className, 'pl-') ||
          getClassNameValue(action.className, 'p-'),
        // Experiment with keeping form state in context
        // Will need to access it from handleSubmit, so might as well keep it handy
        // Could cause perf issues, but whatevs for now
        form: {
          className: action.className,
          width: getClassNameValue(action.className, 'w-'),
        },
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
    className: null,
    position: null,
    display: null,
    width: '',
    minWidth: '',
    height: '',
    minHeight: '',
    marginTop: null,
    marginRight: null,
    marginBottom: null,
    marginLeft: null,
    paddingTop: null,
    paddingRight: null,
    paddingBottom: null,
    paddingLeft: null,
    form: {
      className: '',
      width: '',
    },
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

  return {
    state,
    dispatch,
    updateCurrentField,
  };
}
