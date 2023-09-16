import { create } from 'zustand';
import { defaultForm, defaultPanels } from './default-values';
import { FiberNode } from '../../types';
import classNameValues from '../class-name-values';
import { textColors } from '../tailwind-config';
import replaceClassNameValue from '../replace-class-name-value';

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
  // Form
  form?: FormState;
  currentField?: FormField;
  setCurrentField: (currentField: FormField) => void;
  setFormValue: (field: FormField, value: string) => void;
  setClassName: (className: string) => void;
  /**
   * Replace className with newValue from oldValue
   */
  setClassNameValue: (oldValue: string, newValue: string) => void;
  // Nodes
  selectedNodes: FiberNode[];
  /**
   * Set selected React Fiber nodes. Also populates form `text` and
   * `className` based on element.
   * TODO: Only handles one node for now.
   */
  setSelectedNodes: (selectedNodes: FiberNode[]) => void;
  // Panels
  panels: PanelState[];
  togglePanelStatus: (name: PanelName) => void;
  layersPanelCounter: number;
  refreshLayersPanelCounter: () => void;
};

export const useCodesignStore = create<CodesignAppState>((set) => {
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
      set((state) => {
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

        return {
          selectedNodes,
          form: { ...buildFormValues(className), text },
        };
      }),
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

// TODO: Move this
function buildFormValues(className: string): FormState {
  return {
    className,
    // Layout
    position: className.split(' ').find((value) => {
      return classNameValues.position.includes(value);
    }),
    display: className.split(' ').find((value) => {
      return classNameValues.display.includes(value);
    }),
    flexDirection: getClassNameValue(className, 'flex-'),
    // Sizing
    width: getClassNameValue(className, 'w-'),
    minWidth: getClassNameValue(className, 'min-w-'),
    height: getClassNameValue(className, 'h-'),
    minHeight: getClassNameValue(className, 'min-h-'),
    // Spacing
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
    // Typography
    fontSize: getClassNameValue(className, 'text-'),
    fontWeight: getClassNameValue(className, 'font-'),
    textColor: getPrefixColorValue(className, 'text-'),
    textTransform: className.split(' ').find((value) => {
      return classNameValues.textTransform.includes(value);
    }),
    leading: getClassNameValue(className, 'leading-'),
    // Background
    backgroundColor: getClassNameValue(className, 'bg-'),
    // Effect
    opacity: getClassNameValue(className, 'opacity-'),
  };
}

const baseColors = Object.keys(textColors).map((key) => key);

function getPrefixColorValue(className = '', prefix) {
  let textColorValue;

  for (const baseColor of baseColors) {
    // Most colors have shades, eg. grey-100, grey-200.
    // However black and white do not, so there needs to be different logic to
    // handle these cases.
    const hasShades = Boolean(
      textColors[baseColor] && textColors[baseColor].length > 0,
    );

    if (hasShades) {
      const colorValue = getClassNameValue(
        className,
        `${prefix}${baseColor}${hasShades ? '-' : ''}`,
      );

      if (colorValue) {
        textColorValue = `${baseColor}-${colorValue}`;
        break;
      }
    } else {
      // white and black don't have shades, so color value is same as baseColor
      const hasColorValue = className.includes(`${prefix}${baseColor}`);

      if (hasColorValue) {
        textColorValue = baseColor;
      }
    }
  }

  return textColorValue;
}

function getClassNameValue(className = '', prefix) {
  return className
    .split(' ')
    .filter((c) => {
      return c.includes(prefix);
    })[0]
    ?.replace(prefix, '');
}
