import { FormState, PanelState } from './store';

export const defaultForm: FormState = {
  className: '',
  text: '',
  // Layout
  position: '',
  display: '',
  flexDirection: '',
  // Sizing
  width: '',
  minWidth: '',
  height: '',
  minHeight: '',
  // Spacing
  marginTop: '',
  marginRight: '',
  marginBottom: '',
  marginLeft: '',
  paddingTop: '',
  paddingRight: '',
  paddingBottom: '',
  paddingLeft: '',
  // Typography
  fontSize: '',
  fontWeight: '',
  textColor: '',
  textTransform: '',
  leading: '',
  // Background
  backgroundColor: '',
  // Effect
  opacity: '',
};

export const defaultPanels: PanelState[] = [
  {
    name: 'element',
    status: 'open',
  },
  {
    name: 'layout',
    status: 'open',
  },
  {
    name: 'spacing',
    status: 'open',
  },
  {
    name: 'sizing',
    status: 'open',
  },
  {
    name: 'typography',
    status: 'open',
  },
  {
    name: 'background',
    status: 'open',
  },
  {
    name: 'effect',
    status: 'closed',
  },
  {
    name: 'layers',
    status: 'open',
  },
  {
    name: 'library',
    status: 'open',
  },
];
