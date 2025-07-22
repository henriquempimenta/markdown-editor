import { type Command } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';
import { type ToolbarItem } from '../types';

export const boldCommand: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '**' },
            { from: range.to, insert: '**' },
        ],
        range: range,
    })));
    return true;
};

export const bold: ToolbarItem = {
    icon: '<b>B</b>',
    label: 'Bold',
    command: boldCommand,
};

export const italicCommand: Command = (view) => {
  const currentRange = view.state.selection.main;

  if (currentRange.from >= 1) {
    const charStart = view.state.sliceDoc(currentRange.from - 1, currentRange.from);
    const chatEnd = view.state.sliceDoc(currentRange.to, currentRange.to + 1);

    if (charStart === '*' && chatEnd === '*' &&
      ((currentRange.from < 2 || view.state.sliceDoc(currentRange.from - 1, currentRange.from) !== '*' || view.state.sliceDoc(currentRange.to, currentRange.to + 1) !== '*' ) ||
        (currentRange.from >= 3 && view.state.sliceDoc(currentRange.from - 3, currentRange.from) === '***' && view.state.sliceDoc(currentRange.to, currentRange.to + 3) === '***'))
    ) {
      view.focus();
      return false;
    }
  }

  view.dispatch(
    view.state.changeByRange((range) => {
      return {
        changes: [
          { from: range.from, insert: '*' },
          { from: range.to, insert: '*' },
        ],
        range: EditorSelection.range(range.from + 1, range.to + 1),
      };
    }),
  );
  view.focus();
  return true;
};

export const italic: ToolbarItem = {
    icon: '<i>I</i>',
    label: 'Italic',
    command: italicCommand,
};

export const strikeCommand: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '~~' },
            { from: range.to, insert: '~~' },
        ],
        range: range,
    })));
    return true;
};

export const strike: ToolbarItem = {
    icon: '<s>S</s>',
    label: 'Strike',
    command: strikeCommand,
};

export const underlineCommand: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '<u>' },
            { from: range.to, insert: '</u>' },
        ],
        range: range,
    })));
    return true;
};

export const underline: ToolbarItem = {
    icon: '<u>U</u>',
    label: 'Underline',
    command: underlineCommand,
};