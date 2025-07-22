import { Decoration, DecorationSet, ViewPlugin, ViewUpdate, WidgetType } from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { Range } from '@codemirror/state';
import { nameToEmoji } from 'gemoji';

class EmojiWidget extends WidgetType {
  constructor(readonly emoji: string) {
    super();
  }

  toDOM() {
    const span = document.createElement('span');
    span.className = 'cm-emoji';
    span.textContent = this.emoji;
    return span;
  }
}

function Emojis(view: EditorView) {
  const widgets: Range<Decoration>[] = [];
  const cursorPos = view.state.selection.main.head
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (node) => {
        if (node.name === 'Emoji' && !(node.from <= cursorPos && cursorPos <= node.to)) {
          const emojiCode = view.state.doc.sliceString(node.from + 1, node.to - 1);
          const emoji = nameToEmoji[emojiCode];
          if (emoji) {
            const deco = Decoration.replace({
              widget: new EmojiWidget(emoji),
            });
            widgets.push(deco.range(node.from, node.to));
          }
        }
      },
    });
  }
  return Decoration.set(widgets);
}

export const emojiPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = Emojis(view);
    }

    update(update: ViewUpdate) {
      this.decorations = Emojis(update.view);
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);
