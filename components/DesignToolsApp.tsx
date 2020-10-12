import React from 'react';

import Panel from './Panel';
import PanelRow from './PanelRow';
import LayersPanel from './LayersPanel';
import BackgroundPanel from './BackgroundPanel';
import ElementPanel from './ElementPanel';
import TypographyPanel from './TypographyPanel';

import {
  // DesignToolsProvider,
  useDesignTools,
  types,
} from '../lib/contexts/design-tools-context';
import replaceClassNameValue from '../lib/replace-class-name-value';
import { FiberNode, NodeChangeEvent } from '../types';
import LayoutPanel from './LayoutPanel';
import SpacingPanel from './SpacingPanel';

type Props = {
  selectedNodes: FiberNode[];
  onNodeChange: Function;
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
  fontWeight: 'font',
  backgroundColor: 'bg',
};

const DesignToolsApp = ({ selectedNodes = [], onNodeChange }: Props) => {
  const {
    state,
    dispatch,
    updateCurrentField,
    // updateClassNameValue,
  } = useDesignTools();

  console.log(state.form);

  const selectedNode = selectedNodes[0]; // Allow multi-select in the future
  const className = state?.className;
  const text = state?.text;
  const selectedIDs = selectedNode?._debugID ? [selectedNode._debugID] : [];

  // --------------------------------------------------------------------------
  // Effects
  // --------------------------------------------------------------------------

  // Set selectedNode and initial className
  React.useEffect(() => {
    dispatch({
      type: types.UPDATE_SELECTED_NODE,
      selectedNode,
    });

    // console.log(selectedNode.pendingProps.children);

    const className = selectedNode?.stateNode.className || '';

    dispatch({
      type: types.UPDATE_CLASS_NAME,
      className,
    });
  }, [selectedNode]);

  // Run callback whenever className changes
  React.useEffect(() => {
    handleNodeChange([
      {
        type: 'UPDATE_FILE_CLASS_NAME',
        node: state.selectedNode,
        className,
      },
    ]);
  }, [className]);

  // Run callback whenever className changes
  React.useEffect(() => {
    handleNodeChange([
      {
        type: 'UPDATE_FILE_TEXT',
        node: state.selectedNode,
        text,
      },
    ]);
  }, [text]);

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

    console.log('handleFormSubmit', currentField);
    // Not working
    // event.nativeEvent.stopPropagation();
    // event.nativeEvent.stopImmediatePropagation();

    if (currentField === 'text') {
      dispatch({
        type: types.UPDATE_TEXT,
        text: state.form.text,
      });
    } else {
      if (currentField === 'className') {
        newClassName = state.form.className;
      } else {
        const oldValue = state[currentField];
        const newValue = state.form[currentField];
        const prefix = config[currentField];

        newClassName = replaceClassNameValue(
          state.form.className,
          oldValue ? `${prefix}-${oldValue}` : '',
          newValue ? `${prefix}-${newValue}` : ''
        );

        console.log(oldValue, newValue, prefix, state.form);
      }

      dispatch({
        type: types.UPDATE_CLASS_NAME,
        className: newClassName,
      });
    }
  };

  // TODO: Reconsider params, taking into account potential for
  // creating new elements
  const handleNodeChange = (events: NodeChangeEvent[]) => {
    if (typeof onNodeChange === 'function') {
      onNodeChange([events[0]]);
    }
  };

  // const renderTextInput = ({ field, width = 'w-full' }) => {
  //   return (
  //     <input
  //       className={`${width} p-1 border`}
  //       type="text"
  //       value={state.form[field] || ''}
  //       onFocus={() => updateCurrentField(field)}
  //       onChange={(event) => {
  //         const { value } = event.target;

  //         dispatch({
  //           type: types.UPDATE_FORM_VALUE,
  //           key: field,
  //           value,
  //         });
  //       }}
  //     />
  //   );
  // };

  return (
    <aside className="fixed flex-col overflow-auto top-0 w-64 max-h-full bg-gray-100 border-r text-sm text-gray-800">
      <form className="flex-1" onSubmit={handleFormSubmit}>
        <ElementPanel />

        <LayoutPanel />

        <SpacingPanel />

        <Panel title="Sizing" name="sizing">
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

        <TypographyPanel />

        <BackgroundPanel />

        {/* Form submit button required, otherwise 'enter' key doesn't work properly */}
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>

      {/* Trigger an update of layers by incrementing the key. Useful when new elements are added or when they are removed. LayersPanel internally builds the DOM element hierarchy. TODO: Consider moving this to context state. */}
      <LayersPanel
        selectedIDs={selectedIDs}
        key={state.layersPanelKey}
        onNodeCreateClick={(selectedNode) => {
          handleNodeChange([
            {
              type: 'CREATE_FILE_ELEMENT',
              node: selectedNode,
              elementType: 'div',
            },
          ]);
        }}
      />
    </aside>
  );
};

// const DesignToolsAppWrapper = (props: Props) => {
//   return (
//     <DesignToolsProvider>
//       <DesignToolsApp {...props} />
//     </DesignToolsProvider>
//   );
// };

// export default DesignToolsAppWrapper;

export default DesignToolsApp;
