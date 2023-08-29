import React from 'react';

import LayersPanel from './LayersPanel';
import BackgroundPanel from './BackgroundPanel';
import ElementPanel from './ElementPanel';
import TypographyPanel from './TypographyPanel';
import LayoutPanel from './LayoutPanel';
import SpacingPanel from './SpacingPanel';
import EffectPanel from './EffectPanel';
import SizingPanel from './SizingPanel';

import { useDesignTools, types } from '../lib/contexts/design-tools-context';
import replaceClassNameValue from '../lib/replace-class-name-value';
import { FiberNode, NodeChangeEvent } from '../types';
import { getFiberNodeId } from '../lib/react-fiber-utils';

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

  const className = state?.className;
  const text = state?.text;

  const selectedNode = selectedNodes[0]; // Allow multi-select in the future
  const selectedIds = selectedNode ? [getFiberNodeId(selectedNode)] : [];

  // --------------------------------------------------------------------------
  // Effects
  // --------------------------------------------------------------------------

  // Set selectedNode and initial className
  React.useEffect(() => {
    dispatch({
      type: types.UPDATE_SELECTED_NODE,
      selectedNode,
    });

    const className = selectedNode?.stateNode.className || '';

    dispatch({
      type: types.UPDATE_CLASS_NAME,
      className,
    });
  }, [selectedNode]);

  React.useEffect(() => {
    handleNodeChange([
      {
        type: 'UPDATE_FILE_CLASS_NAME',
        node: selectedNode,
        className,
      },
    ]);
  }, [className]);

  React.useEffect(() => {
    handleNodeChange([
      {
        type: 'UPDATE_FILE_TEXT',
        node: selectedNode,
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
    <div
      className={[
        css.designToolsApp,
        'flex-col w-64 bg-gray-100 text-sm text-gray-800',
        appClassName || '',
      ].join(' ')}
    >
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
        selectedIds={selectedIds}
        refreshCounter={state.layersPanelRefreshCounter}
        onNodeCreateClick={(selectedNode) => {
          // TODO: Add more element types to be created
          handleNodeChange([
            {
              type: 'CREATE_FILE_ELEMENT',
              node: selectedNode,
              elementType: 'p',
            },
          ]);
        }}
      />
    </div>
  );
};

export default DesignToolsApp;
