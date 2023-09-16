import { create } from 'zustand';
import { defaultForm, defaultPanels } from './default-values';
import { FiberNode } from '../../types';
import replaceClassNameValue from '../replace-class-name-value';
import { buildFormValues } from './store-utils';
import { getPathIndexes } from '../html-element-utils';

export type FormState = {
  // TODO: Consider deriving this from formState?
  className?: string;
  text?: string;
  // Layout
  position: string;
  display: string;
  flexDirection: string;
  // Sizing
  width: string;
  minWidth: string;
  height: string;
  minHeight: string;
  // Spacing
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  // Typography
  fontSize: string;
  fontWeight: string;
  textColor: string;
  textTransform: string;
  leading: string;
  // Background
  backgroundColor: string;
  // Effect
  opacity: string;
};

export type FormField = keyof FormState;

export type PanelName =
  | 'element'
  | 'layout'
  | 'spacing'
  | 'sizing'
  | 'typography'
  | 'background'
  | 'effect'
  | 'layers';

export type PanelState = {
  // TODO: key?
  name: PanelName;
  status: 'open' | 'closed';
};

export type CodesignAppState = {
  // --------------------------------------------------------------------------
  // Form
  // --------------------------------------------------------------------------
  form?: FormState;
  currentField?: FormField;
  setCurrentField: (currentField: FormField) => void;
  setFormValue: (field: FormField, value: string) => void;
  setClassName: (className: string) => void;
  /**
   * Replace className with newValue from oldValue
   */
  setClassNameValue: (oldValue: string, newValue: string) => void;

  // --------------------------------------------------------------------------
  // Nodes
  // --------------------------------------------------------------------------
  selectedNodes: FiberNode[];
  /**
   * Set selected React Fiber nodes. Also populates form `text` and
   * `className` based on element.
   * TODO: Only handles one node for now.
   */
  setSelectedNodes: (selectedNodes: FiberNode[]) => void;
  getSelectedNode: () => FiberNode;
  /**
   * The path to element by indexes. TODO: Change to selectedId?
   */
  getSelectedPathIndexes: () => number[];

  // --------------------------------------------------------------------------
  // Panels
  // --------------------------------------------------------------------------
  panels: PanelState[];
  togglePanelStatus: (name: PanelName) => void;
  layersPanelCounter: number;
  refreshLayersPanelCounter: () => void;
};

export const useCodesignStore = create<CodesignAppState>((set, get) => {
  return {
    // Form
    form: defaultForm,
    currentField: null,
    setCurrentField: (currentField: FormField) => set(() => ({ currentField })),
    setFormValue: (field, value) =>
      set((state) => {
        return {
          form: {
            ...state.form,
            // TODO: Consider updating className as well
            [field]: value,
          },
        };
      }),
    setClassName: (className: string) =>
      set((state) => {
        return {
          form: { ...buildFormValues(className), text: state.form.text },
        };
      }),
    setClassNameValue: (oldValue: string, newValue: string) =>
      set((state) => {
        const newClassName = replaceClassNameValue(
          state.form.className,
          oldValue,
          newValue,
        );

        return {
          form: { ...buildFormValues(newClassName), text: state.form.text },
        };
      }),
    // Nodes
    selectedNodes: null,
    setSelectedNodes: (selectedNodes) =>
      set(() => {
        let text: string = null;
        let className;

        if (selectedNodes?.length === 1) {
          const selectedNode = selectedNodes[0];
          // TODO: Check types
          // @ts-ignore
          const children = selectedNode?.pendingProps?.children;
          className = selectedNode?.stateNode?.className || '';

          if (typeof children === 'string') {
            text = children;
          } else if (children?.props?.type === 'text') {
            // Need this for RehypeComponent
            text = children.props.value;
          }
        }

        console.log(
          'store',
          'setSelectedNodes',
          selectedNodes,
          className,
          text,
        );

        return {
          selectedNodes,
          form: { ...buildFormValues(className), text },
        };
      }),
    getSelectedNode: () => {
      const selectedNodes = get().selectedNodes;
      if (selectedNodes?.length) {
        return selectedNodes[0];
      }

      return null;
    },
    getSelectedPathIndexes: () => {
      const node = get().getSelectedNode();

      if (node) {
        return getPathIndexes(node.stateNode);
      }

      return [];
    },
    // Panels
    panels: defaultPanels,
    togglePanelStatus: (name) =>
      set((state) => {
        return {
          panels: state.panels.map((panel) => {
            return {
              ...(panel.name === name
                ? {
                    ...panel,
                    status: panel.status === 'closed' ? 'open' : 'closed',
                  }
                : panel),
            };
          }),
        };
      }),
    layersPanelCounter: 0,
    refreshLayersPanelCounter: () =>
      set((state) => ({ layersPanelCounter: state.layersPanelCounter + 1 })),
  };
});
