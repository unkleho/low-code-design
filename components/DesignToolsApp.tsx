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
  fontSize: 'text',
  backgroundColor: 'bg',
};

const backgroundColors = {
  gray: [
    'bg-gray-100',
    'bg-gray-200',
    'bg-gray-300',
    'bg-gray-400',
    'bg-gray-500',
    'bg-gray-600',
    'bg-gray-700',
    'bg-gray-800',
    'bg-gray-900',
  ],
  red: [
    'bg-red-100',
    'bg-red-200',
    'bg-red-300',
    'bg-red-400',
    'bg-red-500',
    'bg-red-600',
    'bg-red-700',
    'bg-red-800',
    'bg-red-900',
  ],
  orange: [
    'bg-orange-100',
    'bg-orange-200',
    'bg-orange-300',
    'bg-orange-400',
    'bg-orange-500',
    'bg-orange-600',
    'bg-orange-700',
    'bg-orange-800',
    'bg-orange-900',
  ],
  yellow: [
    'bg-yellow-100',
    'bg-yellow-200',
    'bg-yellow-300',
    'bg-yellow-400',
    'bg-yellow-500',
    'bg-yellow-600',
    'bg-yellow-700',
    'bg-yellow-800',
    'bg-yellow-900',
  ],
  green: [
    'bg-green-100',
    'bg-green-200',
    'bg-green-300',
    'bg-green-400',
    'bg-green-500',
    'bg-green-600',
    'bg-green-700',
    'bg-green-800',
    'bg-green-900',
  ],
  teal: [
    'bg-teal-100',
    'bg-teal-200',
    'bg-teal-300',
    'bg-teal-400',
    'bg-teal-500',
    'bg-teal-600',
    'bg-teal-700',
    'bg-teal-800',
    'bg-teal-900',
  ],
  blue: [
    'bg-blue-100',
    'bg-blue-200',
    'bg-blue-300',
    'bg-blue-400',
    'bg-blue-500',
    'bg-blue-600',
    'bg-blue-700',
    'bg-blue-800',
    'bg-blue-900',
  ],
  purple: [
    'bg-purple-100',
    'bg-purple-200',
    'bg-purple-300',
    'bg-purple-400',
    'bg-purple-500',
    'bg-purple-600',
    'bg-purple-700',
    'bg-purple-800',
    'bg-purple-900',
  ],
  indigo: [
    'bg-indigo-100',
    'bg-indigo-200',
    'bg-indigo-300',
    'bg-indigo-400',
    'bg-indigo-500',
    'bg-indigo-600',
    'bg-indigo-700',
    'bg-indigo-800',
    'bg-indigo-900',
  ],
  pink: [
    'bg-pink-100',
    'bg-pink-200',
    'bg-pink-300',
    'bg-pink-400',
    'bg-pink-500',
    'bg-pink-600',
    'bg-pink-700',
    'bg-pink-800',
    'bg-pink-900',
  ],
};

const DesignToolsApp = ({ selectedNodes = [], onSubmit }: Props) => {
  const [classInputValue, setClassInputValue] = React.useState('');

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

  const renderTextInput = ({ field, width = 'w-full' }) => {
    return (
      <input
        className={`${width} p-1 border`}
        type="text"
        value={state.form[field] || ''}
        onFocus={() => updateCurrentField(field)}
        onChange={(event) => {
          const { value } = event.target;

          dispatch({
            type: types.UPDATE_FORM_VALUE,
            key: field,
            value,
          });
        }}
      />
    );
  };

  const baseBgColor = state.form.backgroundColor?.split('-')[0];

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
              <label className="w-16 mr-2 text-xs" htmlFor="element-width">
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
              <label className="w-16 mr-2 text-xs" htmlFor="element-height">
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

        <Panel title="Typography">
          <div className="p-3">
            <PanelRow label="Font Size">
              <input
                className="w-12 p-1 border"
                type="text"
                value={state.form.fontSize || ''}
                onFocus={() => updateCurrentField('fontSize')}
                onChange={(event) => {
                  const { value } = event.target;

                  dispatch({
                    type: types.UPDATE_FORM_VALUE,
                    key: 'fontSize',
                    value,
                  });
                }}
              />
            </PanelRow>
          </div>
        </Panel>

        <Panel title="Background">
          <div className="p-3">
            <PanelRow label="Color">
              {/* {renderTextInput({
                field: 'backgroundColor',
              })} */}

              <div className="w-full">
                <div className="flex items-end w-full">
                  {[
                    'bg-gray-500',
                    'bg-red-500',
                    'bg-orange-500',
                    'bg-yellow-500',
                    'bg-green-500',
                    'bg-teal-500',
                    'bg-blue-500',
                    'bg-indigo-500',
                    'bg-purple-500',
                    'bg-pink-500',
                  ].map((bg) => {
                    const isSelected =
                      bg.replace('bg-', '').replace('-500', '') ===
                      state.form.backgroundColor?.split('-')[0];

                    return (
                      <button
                        type="button"
                        className={[
                          isSelected ? 'h-5' : 'h-4',
                          'flex-1',
                          'border-r border-gray-100',
                          bg,
                        ].join(' ')}
                      ></button>
                    );
                  })}
                </div>
                <div className="flex w-full">
                  {backgroundColors[baseBgColor].map((bg) => {
                    const isSelected =
                      bg.replace('bg-', '') === state.form.backgroundColor;

                    return (
                      <button
                        type="button"
                        className={[
                          isSelected ? 'h-5' : 'h-4',
                          'flex-1 border-t border-r border-gray-100',
                          bg,
                        ].join(' ')}
                      ></button>
                    );
                  })}
                </div>
              </div>
              {/* <input
                className="w-full p-1 border"
                type="text"
                value={state.form.backgroundColor || ''}
                onFocus={() => updateCurrentField('backgroundColor')}
                onChange={(event) => {
                  const { value } = event.target;

                  dispatch({
                    type: types.UPDATE_FORM_VALUE,
                    key: 'backgroundColor',
                    value,
                  });
                }}
              /> */}
            </PanelRow>
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
