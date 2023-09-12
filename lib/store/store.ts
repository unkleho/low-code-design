import { create } from 'zustand';
import { defaultForm, defaultPanels } from './default-values';

export type FormState = {
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
  currentField?: string;
  form?: FormState;
  panels: PanelState[];
  setCurrentField: (currentField: string) => void;
  togglePanelStatus: (name: PanelState['name']) => void;
};

export const useCodesignStore = create<CodesignAppState>((set) => {
  return {
    // Form
    form: defaultForm,
    currentField: null,
    setCurrentField: (currentField: string) => set(() => ({ currentField })),
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
  };
});
