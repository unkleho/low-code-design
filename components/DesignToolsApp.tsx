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

type Props = {
  selectedNodes: FiberNode[];
  nodes: FiberNode[];
  onSubmit: Function;
};

const DesignToolsApp = ({
  selectedNodes = [],
  nodes = [],
  onSubmit,
}: Props) => {
  const [classInputValue, setClassInputValue] = React.useState('');
  const [widthInputValue, setWidthInputValue] = React.useState('');
  const [minWidthInputValue, setMinWidthInputValue] = React.useState('');
  const [heightInputValue, setHeightInputValue] = React.useState('');

  const rootNode = nodes[0];
  const selectedNode = selectedNodes[0]; // Allow multi-select in the future

  // TODO: Consider moving this into context
  const type = selectedNode?.type;
  const lineNumber = selectedNode?._debugSource.lineNumber;
  const columnNumber = selectedNode?._debugSource.columnNumber;
  const fileName = selectedNode?._debugSource.fileName;
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

  React.useEffect(() => {
    setWidthInputValue(state.width);
  }, [state.width]);

  React.useEffect(() => {
    setMinWidthInputValue(state.minWidth);
  }, [state.minWidth]);

  React.useEffect(() => {
    setHeightInputValue(state.height);
  }, [state.height]);

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------

  /**
   * Make changes to className and send data to parent component whenever user
   * presses enter in form.
   */
  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Not working
    // event.nativeEvent.stopPropagation();
    // event.nativeEvent.stopImmediatePropagation();

    let newClassName = classInputValue;

    if (state.currentField === 'width') {
      newClassName = processClassName(
        classInputValue,
        state.width ? `w-${state.width}` : '',
        widthInputValue ? `w-${widthInputValue}` : ''
      );
    } else if (state.currentField === 'minWidth') {
      newClassName = processClassName(
        classInputValue,
        state.minWidth ? `min-w-${state.minWidth}` : '',
        minWidthInputValue ? `min-w-${minWidthInputValue}` : ''
      );
    } else if (state.currentField === 'height') {
      newClassName = processClassName(
        classInputValue,
        state.height ? `h-${state.height}` : '',
        heightInputValue ? `h-${heightInputValue}` : ''
      );
    }

    console.log('currentField', state.currentField);
    console.log('widthInputValue', widthInputValue);
    console.log('old', classInputValue);
    console.log('new', newClassName);

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
            <PanelRow label="Margin">
              <input
                type="text"
                placeholder="t"
                value={state.marginTop || ''}
                className="flex-1 w-full p-1 mr-1 border border-t-2"
              />
              <input
                type="text"
                placeholder="r"
                value={state.marginRight || ''}
                className="flex-1 w-full p-1 mr-1 border border-r-2"
              />
              <input
                type="text"
                placeholder="b"
                value={state.marginBottom || ''}
                className="flex-1 w-full p-1 mr-1 border border-b-2"
              />
              <input
                type="text"
                placeholder="l"
                value={state.marginLeft || ''}
                className="flex-1 w-full p-1 border border-l-2"
              />
            </PanelRow>

            <PanelRow label="Padding">
              <input
                type="text"
                placeholder="t"
                value={state.paddingTop || ''}
                className="flex-1 w-full p-1 mr-1 border border-t-2"
              />
              <input
                type="text"
                placeholder="r"
                value={state.paddingRight || ''}
                className="flex-1 w-full p-1 mr-1 border border-r-2"
              />
              <input
                type="text"
                placeholder="b"
                value={state.paddingBottom || ''}
                className="flex-1 w-full p-1 mr-1 border border-b-2"
              />
              <input
                type="text"
                placeholder="l"
                value={state.paddingLeft || ''}
                className="flex-1 w-full p-1 border border-l-2"
              />
            </PanelRow>
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
                value={widthInputValue || ''}
                onFocus={() => updateCurrentField('width')}
                onChange={(event) => {
                  const { value } = event.target;

                  setWidthInputValue(value);
                }}
              />
              <label className="text-xs mr-2">Min-Width</label>
              <input
                type="text"
                className="flex-1 w-full p-1 border"
                onFocus={() => updateCurrentField('minWidth')}
                onChange={(event) => {
                  const { value } = event.target;

                  setMinWidthInputValue(value);
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
                value={heightInputValue || ''}
                onFocus={() => updateCurrentField('height')}
                onChange={(event) => {
                  const { value } = event.target;

                  setHeightInputValue(value);
                }}
              />
              <label className="text-xs mr-2">Min-Height</label>
              <input
                type="text"
                className="flex-1 w-full p-1 border"
                onFocus={() => updateCurrentField('minHeight')}
              />
            </div>
          </div>
        </Panel>

        {/* Form submit button required, otherwise 'enter' key doesn't work properly */}
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>

      <Panel title="Layers">
        <div className="py-1">
          <NodeTree
            parentID={rootNode?.return._debugID}
            nodes={nodes}
            selectedIDs={selectedIDs}
            // dataId={dataId}
          />
        </div>
      </Panel>
      {/* </form> */}
    </aside>
  );
};

const DesignToolsAppWrapper = (props) => {
  return (
    <DesignToolsProvider>
      <DesignToolsApp {...props} />
    </DesignToolsProvider>
  );
};

/**
 * Append or replace a newValue in a className string
 */
function processClassName(className, oldValue, newValue) {
  const newClassName = oldValue
    ? // Replace with new value
      className.replace(oldValue, newValue)
    : // Otherwise append to className
      `${className}${newValue ? ` ${newValue}` : ''}`;

  return newClassName;
}

export default DesignToolsAppWrapper;
