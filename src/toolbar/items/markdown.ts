import { type Command } from '@codemirror/view';
import { type ToolbarItem } from '../types';
import { createHeading, createList } from './helpers';

const boldCommand: Command = (view) => {
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



const italicCommand: Command = (view) => {
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

const strikeCommand: Command = (view) => {
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

const underlineCommand: Command = (view) => {
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


export const h1: ToolbarItem = {
    icon: '<b>H1</b>',
    label: 'H1',
    command: createHeading(1),
};

export const h2: ToolbarItem = {
    icon: '<b>H2</b>',
    label: 'H2',
    command: createHeading(2),
};

export const h3: ToolbarItem = {
    icon: '<b>H3</b>',
    label: 'H3',
    command: createHeading(3),
};

export const h4: ToolbarItem = {
    icon: '<b>H4</b>',
    label: 'H4',
    command: createHeading(4),
};

export const h5: ToolbarItem = {
    icon: '<b>H5</b>',
    label: 'H5',
    command: createHeading(5),
};

export const h6: ToolbarItem = {
    icon: '<b>H6</b>',
    label: 'H6',
    command: createHeading(6),
};

import { type ChangeSpec, EditorSelection } from '@codemirror/state';

const quoteCommand: Command = (view) => {
  const { state } = view;
  const { doc } = state;

  view.dispatch(
    view.state.changeByRange((range) => {
      const startLine = doc.lineAt(range.from);
      const text = doc.slice(range.from, range.to);
      const lineCount = text.lines;
      const changes: ChangeSpec[] = [];
      let selectionStart: number = range.from;
      let selectionLength: number = range.to - range.from;

      new Array(lineCount).fill(0).forEach((_, index) => {
        const line = doc.line(startLine.number + index);
        if (line.text.startsWith('> ')) {
          return;
        }
        changes.push({
          from: line.from,
          insert: '> ',
        });
        if (index === 0) {
          selectionStart = selectionStart + 2;
        } else {
          selectionLength += 2;
        }
      });

      return {
        changes,
        range: EditorSelection.range(selectionStart, selectionStart + selectionLength),
      };
    }),
  );
  view.focus();
  return true;
};

export const quote: ToolbarItem = {
    icon: '“'  ,
    label: 'Quote',
    command: quoteCommand,
};

export const ul: ToolbarItem = {
    icon: '•',
    label: 'Unordered List',
    command: createList('ul'),
};

export const ol: ToolbarItem = {
    icon: '1.',
    label: 'Ordered List',
    command: createList('ol'),
};

export const todo: ToolbarItem = {
    icon: '☐',
    label: 'Todo',
    command: createList('todo'),
};

const linkCommand: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '[]()' },
        ],
        range: range,
    })));
    return true;
};

export const link: ToolbarItem = {
    icon: '🔗',
    label: 'Link',
    command: linkCommand,
};

const imageCommand: Command = (view) => {
  const { state, dispatch } = view;
  const { from, to } = state.selection.main;
  const text = state.sliceDoc(from, to);
  const changes: ChangeSpec[] = [];
  let selectionStart = from;
  let selectionEnd = to;

  if (text.startsWith('!') && text.endsWith(')')) {
    // Remove image markdown
    changes.push(
      { from: from, to: from + 1, insert: '' }, // Remove !
      { from: to - 1, to: to, insert: '' }, // Remove )
    );
    selectionStart = from;
    selectionEnd = to - 2;
  } else {
    // Add image markdown
    changes.push(
      { from: from, insert: '![](' },
      { from: to, insert: ')' },
    );
    selectionStart = from + 4;
    selectionEnd = to + 4;
  }

  dispatch(state.update({
    changes,
    selection: EditorSelection.create([EditorSelection.range(selectionStart, selectionEnd)]),
  }));

  view.focus();
  return true;
};

export const image: ToolbarItem = {
    icon: '🖼️',
    label: 'Image',
    command: imageCommand,
};
