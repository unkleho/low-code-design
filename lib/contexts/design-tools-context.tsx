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
        ...buildFormValues(action.className),
        // Experiment with keeping form state in context
        // Will need to access it from handleSubmit, so might as well keep it handy
        // Could cause perf issues, but whatevs for now
        form: buildFormValues(action.className),
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
    ...defaultFormValues,
    form: defaultFormValues,
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

const defaultFormValues = {
  className: '',
  position: '',
  display: '',
  width: '',
  minWidth: '',
  height: '',
  minHeight: '',
  marginTop: '',
  marginRight: '',
  marginBottom: '',
  marginLeft: '',
  paddingTop: '',
  paddingRight: '',
  paddingBottom: '',
  paddingLeft: '',
};

function buildFormValues(className) {
  return {
    className,
    position: className.split(' ').find((c) => {
      return ['relative', 'absolute', 'sticky'].includes(c);
    }),
    display: className.split(' ').find((c) => {
      return ['block', 'flex', 'grid'].includes(c);
    }),
    width: getClassNameValue(className, 'w-'),
    minWidth: getClassNameValue(className, 'min-w-'),
    height: getClassNameValue(className, 'h-'),
    minHeight: getClassNameValue(className, 'min-h-'),
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
  };
}
