import { Decoration, DecorationSet, ViewPlugin, ViewUpdate, WidgetType } from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { Range } from '@codemirror/state';

class HorizontalRuleWidget extends WidgetType {
  toDOM() {
    const div = document.createElement('div');
    div.className = 'cm-hr';
    return div;
  }
}

function decorate(view: EditorView) {
  const widgets: Range<Decoration>[] = [];
  const cursorPos = view.state.selection.main.head;
  const cursorLine = view.state.doc.lineAt(cursorPos);

  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (node) => {
        if (node.name === 'HorizontalRule') {
          const line = view.state.doc.lineAt(node.from);
          if (line.number !== cursorLine.number) {
            const deco = Decoration.replace({
              widget: new HorizontalRuleWidget(),
            });
            widgets.push(deco.range(node.from, node.to));
          }
        }
      },
    });
  }
  return Decoration.set(widgets);
}

export const horizontalRulePlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = decorate(view);
    }

    update(update: ViewUpdate) {
      this.decorations = decorate(update.view);
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);
