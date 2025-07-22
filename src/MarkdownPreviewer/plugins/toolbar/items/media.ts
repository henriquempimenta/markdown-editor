import { type Command } from '@codemirror/view';
import { type ToolbarItem } from '../types';
import { type ChangeSpec, EditorSelection } from '@codemirror/state';

export const linkCommand: Command = (view) => {
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

export const imageCommand: Command = (view) => {
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