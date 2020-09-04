import React from 'react';

import Panel from './Panel';
import PanelRow from './PanelRow';
import NodeTree from './NodeTree';
import {
  DesignToolsProvider,
  useDesignTools,
  types,
} from '../lib/contexts/design-tools-context';

import { FiberNode } from '../types';
import LayersPanel from './LayersPanel';

type Props = {
  selectedNodes: FiberNode[];
  onSubmit: Function;
};

const config = {
  width: 'w',
  minWidth: 'min-w',
  height: 'h',
  minHeight: 'min-h',
  marginTop: 'mt',
  marginRight: 'mr',
  marginBottom: 'mb',
  marginLeft: 'ml',
  paddingTop: 'pt',
  paddingRight: 'pr',
  paddingBottom: 'pb',
  paddingLeft: 'pl',
};

const DesignToolsApp = ({ selectedNodes = [], onSubmit }: Props) => {
  const [classInputValue, setClassInputValue] = React.useState('');
  // const [widthInputValue, setWidthInputValue] = React.useState('');
  // const [minWidthInputValue, setMinWidthInputValue] = React.useState('');
  // const [heightInputValue, setHeightInputValue] = React.useState('');

  const selectedNode = selectedNodes[0]; // Allow multi-select in the future

  // TODO: Consider moving this into context
  const type = selectedNode?.type;
  const lineNumber = selectedNode?._debugSource?.lineNumber;
  const columnNumber = selectedNode?._debugSource?.columnNumber;
  const fileName = selectedNode?._debugSource?.fileName;
  const className = selectedNode?.stateNode.className || '';
  const selectedIDs = selectedNode?._debugID ? [selectedNode._debugID] : [];

  const { state, dispatch, updateCurrentField } = useDesignTools();

  // --------------------------------------------------------------------------
  // Effects
  // --------------------------------------------------------------------------

  // Set initial className when there is a new selectedNode
  React.useEffect(() => {
    setClassInputValue(className);

    dispatch({
      type: types.UPDATE_CLASS_NAME,
      className,
    });
  }, [className]);

  // Update className text field and send callback
  React.useEffect(() => {
    setClassInputValue(state.className);
  }, [state.className]);

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------

  /**
   * Make changes to className and send data to parent component whenever user
   * presses enter in form.
   */
  const handleFormSubmit = (event) => {
    event.preventDefault();

    const { currentField } = state;
    let newClassName;

    // Not working
    // event.nativeEvent.stopPropagation();
    // event.nativeEvent.stopImmediatePropagation();

    if (currentField === 'className') {
      newClassName = classInputValue;
    } else {
      const oldValue = state[currentField];
      const newValue = state.form[currentField];
      const prefix = config[currentField];

      newClassName = processClassName(
        classInputValue,
        oldValue ? `${prefix}-${oldValue}` : '',
        newValue ? `${prefix}-${newValue}` : ''
      );
    }

    dispatch({
      type: types.UPDATE_CLASS_NAME,
      className: newClassName,
    });

    handleSubmit({
      node: selectedNode,
      newClassName: newClassName,
    });
  };

  const handleClassInputChange = (event) => {
    setClassInputValue(event.target.value);
  };

  const handleSubmit = ({ node, newClassName }) => {
    if (typeof onSubmit === 'function') {
      onSubmit([
        {
          node,
          update: {
            className: newClassName,
          },
        },
      ]);
    }
  };

  return (
    <aside className="fixed flex-col overflow-auto top-0 w-64 max-h-full bg-gray-100 border-r text-sm text-gray-800">
      <form className="flex-1" onSubmit={handleFormSubmit}>
        <Panel title="Element">
          <div className="p-3">
            <PanelRow label="Type">
              {type && (
                <span
                  className="px-2 py-1 font-bold bg-gray-200"
                  title={`Line ${lineNumber}, column ${columnNumber}, ${fileName}`}
                >
                  {type}
                </span>
              )}
            </PanelRow>

            <PanelRow label="Class">
              <input
                type="text"
                value={classInputValue || ''}
                className="p-1 flex-1 border border-blue"
                onFocus={() => updateCurrentField('className')}
                onChange={handleClassInputChange}
              />
            </PanelRow>
          </div>
        </Panel>

        <Panel title="Layout">
          <div className="p-3">
            <PanelRow label="Position">
              <select
                className="p-1 border"
                value={state.position || ''}
                onChange={(event) => {
                  const { value } = event.target;

                  const newClassName = state.position
                    ? // Replace with new value
                      state.className.replace(state.position, value)
                    : // Otherwise append to className
                      `${state.className} ${value}`;

                  dispatch({
                    type: types.UPDATE_CLASS_NAME,
                    className: newClassName,
                  });

                  handleSubmit({
                    node: selectedNode,
                    newClassName,
                  });
                }}
              >
                <option label=" "></option>
                {['relative', 'absolute', 'sticky'].map((option) => {
                  return (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </PanelRow>

            <PanelRow label="Display">
              <select
                className="p-1 border"
                value={state.display || ''}
                onChange={(event) => {
                  const { value } = event.target;

                  const newClassName = processClassName(
                    state.className,
                    state.display,
                    value
                  );

                  dispatch({
                    type: types.UPDATE_CLASS_NAME,
                    className: newClassName,
                  });

                  handleSubmit({
                    node: selectedNode,
                    newClassName,
                  });
                }}
              >
                <option label=" "></option>
                {['block', 'flex', 'grid'].map((option) => {
                  return (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </PanelRow>
          </div>
        </Panel>

        <Panel title="Spacing">
          <div className="p-3">
            {['margin', 'padding'].map((spacing) => {
              return (
                <PanelRow label={spacing} key={spacing}>
                  {[
                    {
                      side: 't',
                      field: `${spacing}Top`,
                    },
                    {
                      side: 'r',
                      field: `${spacing}Right`,
                    },
                    {
                      side: 'b',
                      field: `${spacing}Bottom`,
                    },
                    {
                      side: 'l',
                      field: `${spacing}Left`,
                    },
                  ].map((space) => {
                    return (
                      <input
                        type="text"
                        placeholder={space.side}
                        value={state.form[space.field] || ''}
                        className={`flex-1 w-full p-1 mr-1 border border-${space.side}-4`}
                        key={space.side}
                        onFocus={() => updateCurrentField(space.field)}
                        onChange={(event) => {
                          const { value } = event.target;

                          dispatch({
                            type: types.UPDATE_FORM_VALUE,
                            key: space.field,
                            value,
                          });
                        }}
                      />
                    );
                  })}
                </PanelRow>
              );
            })}
          </div>
        </Panel>

        <Panel title="Sizing">
          <div className="p-3">
            <div className="flex items-baseline mb-2">
              <label className="w-12 mr-2 text-xs" htmlFor="element-width">
                Width
              </label>
              <input
                type="text"
                id="element-width"
                className="flex-1 w-full p-1 mr-4 border"
                value={state.form.width || ''}
                onFocus={() => updateCurrentField('width')}
                onChange={(event) => {
                  const { value } = event.target;

                  dispatch({
                    type: types.UPDATE_FORM_VALUE,
                    key: 'width',
                    value,
                  });
                }}
              />
              <label className="text-xs mr-2">Min-Width</label>
              <input
                type="text"
                className="flex-1 w-full p-1 border"
                value={state.form.minWidth || ''}
                onFocus={() => updateCurrentField('minWidth')}
                onChange={(event) => {
                  const { value } = event.target;

                  dispatch({
                    type: types.UPDATE_FORM_VALUE,
                    key: 'minWidth',
                    value,
                  });
                }}
              />
            </div>
            <div className="flex items-baseline">
              <label className="w-12 mr-2 text-xs" htmlFor="element-height">
                Height
              </label>
              <input
                type="text"
                id="element-height"
                className="flex-1 w-full p-1 mr-4 border"
                value={state.form.height || ''}
                onFocus={() => updateCurrentField('height')}
                onChange={(event) => {
                  const { value } = event.target;

                  dispatch({
                    type: types.UPDATE_FORM_VALUE,
                    key: 'height',
                    value,
                  });
                }}
              />
              <label className="text-xs mr-2">Min-Height</label>
              <input
                type="text"
                className="flex-1 w-full p-1 border"
                value={state.form.minHeight || ''}
                onFocus={() => updateCurrentField('minHeight')}
                onChange={(event) => {
                  const { value } = event.target;

                  dispatch({
                    type: types.UPDATE_FORM_VALUE,
                    key: 'minHeight',
                    value,
                  });
                }}
              />
            </div>
          </div>
        </Panel>

        {/* Form submit button required, otherwise 'enter' key doesn't work properly */}
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>

      <LayersPanel selectedIDs={selectedIDs} />
    </aside>
  );
};

const DesignToolsAppWrapper = (props: Props) => {
  return (
    <DesignToolsProvider>
      <DesignToolsApp {...props} />
    </DesignToolsProvider>
  );
};

/**
 * Append or replace a newValue in a className string
 */
export function processClassName(className, oldValue, newValue) {
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

  // const newClassName = oldValue
  //   ? // Replace with new value
  //     className.replace(oldValue, newValue)
  //   : // Otherwise append to className
  //     `${className}${newValue ? ` ${newValue}` : ''}`;

  return newClassName.trim();
}

export default DesignToolsAppWrapper;
