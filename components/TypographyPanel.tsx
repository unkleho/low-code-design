import React from 'react';
import Panel from './Panel';
import PanelRow from './PanelRow';
import classNameValues from '../lib/class-name/class-name-values';
import { useCodesignStore } from '../lib/store/store';
import { ColorPicker } from './ColorPicker';

const TypographyPanel = () => {
  const { form, setClassNameValue } = useCodesignStore();

  const { textColor } = form;

  return (
    <Panel title="Typography" name="typography">
      <div className="px-4">
        <PanelRow label="Font Size">
          <select
            className="p-1 border"
            value={form.fontSize || ''}
            onChange={(event) => {
              const { value } = event.target;

              setClassNameValue(
                form.fontSize ? `text-${form.fontSize}` : '',
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

        <PanelRow label="Weight">
          <select
            className="p-1 border"
            value={form.fontWeight || ''}
            onChange={(event) => {
              const { value } = event.target;

              setClassNameValue(
                form.fontWeight ? `font-${form.fontWeight}` : '',
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
            onColourClick={(colour) => {
              setClassNameValue(
                textColor ? `text-${textColor}` : '',
                colour ? `text-${colour}` : '',
              );
            }}
          />
        </PanelRow>

        <PanelRow label="Transform">
          <select
            className="p-1 border"
            value={form.textTransform || ''}
            onChange={(event) => {
              const { value } = event.target;

              setClassNameValue(form.textTransform, value);
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
            value={form.leading || ''}
            onChange={(event) => {
              const { value } = event.target;

              setClassNameValue(
                form.leading ? `leading-${form.leading}` : '',
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
