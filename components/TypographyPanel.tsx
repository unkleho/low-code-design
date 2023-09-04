import React from 'react';
import { useDesignTools } from '../lib/contexts/design-tools-context';

import Panel from './Panel';
import PanelRow from './PanelRow';

import classNameValues from '../lib/class-name-values';
import ColorPicker from './ColorPicker';

const TypographyPanel = () => {
  const { state, updateClassNameValue } = useDesignTools();
  const { textColor } = state.form;

  return (
    <Panel title="Typography" name="typography">
      <div className="p-3">
        <PanelRow label="Font Size">
          <select
            className="p-1 border"
            value={state.form.fontSize || ''}
            onChange={(event) => {
              const { value } = event.target;

              updateClassNameValue(
                state.form.fontSize ? `text-${state.form.fontSize}` : '',
                value ? `text-${value}` : '',
              );
            }}
          >
            <option label=" "></option>
            {classNameValues.fontSize.map((option) => {
              return (
                <option value={option} key={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </PanelRow>

        {/* <PanelRow label="Font Size">
          <input
            className="w-12 p-1 border"
            type="text"
            value={state.form.fontSize || ''}
            onFocus={() => updateCurrentField('fontSize')}
            onChange={(event) => {
              const { value } = event.target;

              dispatch({
                type: types.UPDATE_FORM_VALUE,
                key: 'fontSize',
                value,
              });
            }}
          />
        </PanelRow> */}

        <PanelRow label="Weight">
          <select
            className="p-1 border"
            value={state.form.fontWeight || ''}
            onChange={(event) => {
              const { value } = event.target;

              updateClassNameValue(
                state.form.fontWeight ? `font-${state.form.fontWeight}` : '',
                value ? `font-${value}` : '',
              );
            }}
          >
            <option label=" "></option>
            {classNameValues.fontWeight.map((option) => {
              return (
                <option value={option} key={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </PanelRow>

        <PanelRow label="Color">
          <ColorPicker
            selectedColor={textColor}
            onColorClick={(color) => {
              // TODO: Consider wrapping function to handle ternaries
              updateClassNameValue(
                textColor ? `text-${textColor}` : '',
                color ? `text-${color}` : '',
              );
            }}
          />
        </PanelRow>

        <PanelRow label="Transform">
          <select
            className="p-1 border"
            value={state.form.textTransform || ''}
            onChange={(event) => {
              const { value } = event.target;

              updateClassNameValue(state.form.textTransform, value);
            }}
          >
            <option label=" "></option>
            {classNameValues.textTransform.map((option) => {
              return (
                <option value={option} key={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </PanelRow>
        <PanelRow label="Leading">
          <select
            className="p-1 border"
            value={state.form.leading || ''}
            onChange={(event) => {
              const { value } = event.target;

              updateClassNameValue(
                state.form.leading ? `leading-${state.form.leading}` : '',
                value ? `leading-${value}` : '',
              );
            }}
          >
            <option label=" "></option>
            {classNameValues.leading.map((option) => {
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
  );
};

export default TypographyPanel;
