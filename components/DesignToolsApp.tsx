import React from 'react';

import LayersPanel from './LayersPanel';
import BackgroundPanel from './BackgroundPanel';
import ElementPanel from './ElementPanel';
import TypographyPanel from './TypographyPanel';
import LayoutPanel from './LayoutPanel';
import SpacingPanel from './SpacingPanel';
import ControlPanel from './ControlPanel';
import EffectPanel from './EffectPanel';
import SizingPanel from './SizingPanel';
import Icon from './Icon';

import { useDesignTools, types } from '../lib/contexts/design-tools-context';
import replaceClassNameValue from '../lib/replace-class-name-value';
import { FiberNode, NodeChangeEvent } from '../types';

import css from './DesignToolsApp.module.css';

type Props = {
  selectedNodes: FiberNode[];
  className?: string;
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

const DesignToolsApp = ({
  selectedNodes = [],
  className: appClassName,
  onNodeChange,
}: Props) => {
  const { state, dispatch } = useDesignTools();

  const selectedNode = selectedNodes[0]; // Allow multi-select in the future
  const className = state?.className;
  const text = state?.text;
  const designToolsStatus = state?.designToolsStatus;
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

    // Not working
    // event.nativeEvent.stopPropagation();
    // event.nativeEvent.stopImmediatePropagation();

    if (currentField === 'text') {
      dispatch({
        type: types.UPDATE_TEXT,
        text: state.form.text,
      });
    } else {
      let newClassName;

      if (currentField === 'className') {
        newClassName = state.form.className;
      } else {
        const oldValue = state[currentField];
        const newValue = state.form[currentField];
        const prefix = config[currentField];

        // Sorry, need to check for negative values, so a bit messy right now.
        // TODO: Consider moving this funky logic to reducer
        newClassName = replaceClassNameValue(
          state.form.className,
          oldValue
            ? `${oldValue.charAt(0) === '-' ? '-' : ''}${prefix}-${
                oldValue.charAt(0) === '-' ? oldValue.substring(1) : oldValue
              }`
            : '',
          newValue
            ? `${newValue.charAt(0) === '-' ? '-' : ''}${prefix}-${
                newValue.charAt(0) === '-' ? newValue.substring(1) : newValue
              }`
            : '',
        );
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

  return (
    <>
      {designToolsStatus === 'closed' && (
        <div className="absolute top-0 p-2">
          <button
            className="p-1 bg-gray-400 rounded-lg"
            onClick={() => {
              dispatch({
                type: types.TOGGLE_DESIGN_TOOLS,
              });
            }}
          >
            <Icon name="chevron-right" />
          </button>
        </div>
      )}

      <aside
        className={[
          css.designToolsApp,
          'absolute flex-col overflow-auto top-0 w-64 max-h-full bg-gray-100 border-r text-sm text-gray-800 transition-all duration-300',
          designToolsStatus === 'closed' ? '-ml-64' : '',
          appClassName || '',
        ].join(' ')}
      >
        <ControlPanel />

        <form className="flex-1" onSubmit={handleFormSubmit}>
          <ElementPanel />

          <LayoutPanel />

          <SpacingPanel />

          <SizingPanel />

          <TypographyPanel />

          <BackgroundPanel />

          <EffectPanel />

          {/* Form submit button required, otherwise 'enter' key doesn't work properly */}
          <button type="submit" className="hidden">
            Submit
          </button>
        </form>

        {/* Trigger an update of layers by incrementing the key. Useful when new elements are added or when they are removed. LayersPanel internally builds the DOM element hierarchy. TODO: Consider moving this to context state. */}
        <LayersPanel
          selectedIDs={selectedIDs}
          refreshCounter={state.layersPanelRefreshCounter}
          onNodeCreateClick={(selectedNode) => {
            handleNodeChange([
              {
                type: 'CREATE_FILE_ELEMENT',
                node: selectedNode,
                elementType: 'p',
              },
            ]);
          }}
        />
      </aside>
    </>
  );
};

export default DesignToolsApp;
