import React from 'react';

import LayersPanel from './LayersPanel';
import BackgroundPanel from './BackgroundPanel';
import ElementPanel from './ElementPanel';
import TypographyPanel from './TypographyPanel';
import LayoutPanel from './LayoutPanel';
import SpacingPanel from './SpacingPanel';
import EffectPanel from './EffectPanel';
import SizingPanel from './SizingPanel';

import { updateClassName } from '../lib/class-name/class-name-utils';
import { CodesignMode, FiberNode, NodeChangeEvent } from '../types';
import { getFiberNodeId } from '../lib/react-fiber-utils';

import css from './CodesignSidebar.module.css';
import usePrevious from '../lib/hooks/use-previous';
import { useCodesignStore } from '../lib/store/store';

type Props = {
  selectedNodes: FiberNode[];
  mode?: CodesignMode;
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
  mode = 'live',
  className: appClassName,
  onNodeChange,
}: Props) => {
  const {
    currentField,
    form,
    selectedNodes: nodes,
    setSelectedNodes,
    setClassName,
    setFormValue,
    layersPanelCounter,
  } = useCodesignStore();

  const { text, className } = form;

  // Allow multi-select in the future
  const selectedNode = selectedNodes[0];
  const node = nodes?.[0];

  // Array of path indexes eg. ['0-0-1']
  const selectedId = node ? getFiberNodeId(node) : '';
  const prevSelectedId = usePrevious(selectedId);
  const prevClassName = usePrevious(className);
  const prevText = usePrevious(text);

  // console.log('CodesignSidebar', {
  //   prevSelectedId,
  //   selectedId,
  //   prevText,
  //   text,
  //   prevClassName,
  //   className,
  // });

  // --------------------------------------------------------------------------
  // Effects
  // --------------------------------------------------------------------------

  // Set selectedNode into store. This also sets `text` and `className`
  React.useEffect(() => {
    setSelectedNodes([selectedNode]);

    handleNodeChange([
      {
        type: 'SELECT_NODE',
        node: selectedNode,
      },
    ]);
  }, [selectedNode]);

  React.useEffect(() => {
    if (selectedId === prevSelectedId && prevClassName !== className) {
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
    if (selectedId === prevSelectedId && prevText !== text) {
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

    // console.log('Sidebar', 'handleFormSubmit');

    if (currentField === 'text') {
      // Not sure if this works
      setFormValue('text', form.text);
    } else {
      let newClassName;

      if (currentField === 'className') {
        newClassName = form.className;
      } else {
        const newValue = form[currentField];
        const prefix = config[currentField];

        newClassName = updateClassName(form.className, prefix, newValue);
      }

      setClassName(newClassName);
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
        'flex-col w-72 bg-gray-50 text-sm text-gray-800',
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
        mode={mode}
        selectedIds={[selectedId]}
        refreshCounter={layersPanelCounter}
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
