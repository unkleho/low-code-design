import React from 'react';

import LayersPanel from './LayersPanel';
import BackgroundPanel from './BackgroundPanel';
import ElementPanel from './ElementPanel';
import TypographyPanel from './TypographyPanel';
import LayoutPanel from './LayoutPanel';
import SpacingPanel from './SpacingPanel';
import EffectPanel from './EffectPanel';
import SizingPanel from './SizingPanel';

import { useCodesign, types } from '../lib/contexts/codesign-context';
import { updateClassName } from '../lib/replace-class-name-value';
import { FiberNode, NodeChangeEvent } from '../types';
import { getFiberNodeId } from '../lib/react-fiber-utils';

import css from './CodesignSidebar.module.css';
import usePrevious from '../lib/hooks/use-previous';
import { useCodesignStore } from '../lib/store/store';

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

const CodesignSidebar = ({
  selectedNodes = [],
  className: appClassName,
  onNodeChange,
}: Props) => {
  const { state, dispatch } = useCodesign();
  const { currentField } = useCodesignStore();

  // console.log('CodesignSidebar', state.form, prevState.form);

  const className = state?.form.className;
  const text = state?.text;

  const selectedNode = selectedNodes[0]; // Allow multi-select in the future

  // Array of path indexes eg. ['0-0-1']
  const selectedId = selectedNode ? getFiberNodeId(selectedNode) : '';
  const prevSelectedId = usePrevious(selectedId);

  console.log('CodesignSidebar selectedIds', selectedId, prevSelectedId);

  // --------------------------------------------------------------------------
  // Effects
  // --------------------------------------------------------------------------

  // Set selectedNode and initial className
  React.useEffect(() => {
    dispatch({
      type: types.UPDATE_SELECTED_NODE,
      selectedNode,
    });

    const className = selectedNode?.stateNode?.className || '';

    dispatch({
      type: types.UPDATE_CLASS_NAME,
      className,
    });
  }, [selectedNode]);

  React.useEffect(() => {
    if (selectedId === prevSelectedId) {
      handleNodeChange([
        {
          type: 'UPDATE_FILE_CLASS_NAME',
          node: selectedNode,
          className,
        },
      ]);
    }
  }, [className]);

  React.useEffect(() => {
    if (selectedId === prevSelectedId) {
      handleNodeChange([
        {
          type: 'UPDATE_FILE_TEXT',
          node: selectedNode,
          text,
        },
      ]);
    }
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

    // const { currentField } = state;

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

        newClassName = updateClassName(state.form.className, prefix, newValue);
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
        selectedIds={[selectedId]}
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

export default CodesignSidebar;
