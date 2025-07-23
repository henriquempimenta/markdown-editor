import { EditorState } from '@codemirror/state';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { horizontalRulePlugin } from './horizontalRule';
import { Decoration, EditorView } from '@codemirror/view';
import { describe, it, expect } from 'vitest';

describe('horizontalRulePlugin', () => {
  const createEditorState = (doc: string) => {
    return EditorState.create({
      doc,
      extensions: [markdown({ base: markdownLanguage }), horizontalRulePlugin],
    });
  };

  const getDecorations = (view: EditorView) => {
    const plugin = view.plugin(horizontalRulePlugin);
    const decorations: { from: number; to: number; value: Decoration; }[] = [];
    if (plugin) {
      plugin.decorations.between(0, view.state.doc.length, (from, to, value) => {
        decorations.push({ from, to, value });
      });
    }
    return decorations;
  };

  it('should replace HorizontalRule with a widget when cursor is on a different line', () => {
    const doc = '---\n';
    const state = createEditorState(doc);
    const view = new EditorView({ state });
    view.dispatch({ selection: { anchor: doc.length } });
    const decorations = getDecorations(view);
    expect(decorations).toHaveLength(1);
  });

  it('should not replace HorizontalRule with a widget when cursor is on the same line', () => {
    const doc = '---\n';
    const state = createEditorState(doc);
    const view = new EditorView({ state });
    view.dispatch({ selection: { anchor: 0 } });
    const decorations = getDecorations(view);
    expect(decorations).toHaveLength(0);
  });
});
