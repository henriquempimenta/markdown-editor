import { EditorState } from '@codemirror/state';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { emojiPlugin } from './emoji';
import { Decoration, EditorView } from '@codemirror/view';
import { describe, it, expect } from 'vitest';

describe('emojiPlugin', () => {
  it('should find one emoji', () => {
    const emojiMarkdown = ':joy: ';
    const state = createEditorState(emojiMarkdown);
    const view = new EditorView({ state });
    view.dispatch({ selection: { anchor: state.doc.length } });
    const decorations = getDecorations(view);
    expect(decorations).toHaveLength(1);
  });

  it('should find two emojis', () => {
    const emojiMarkdown = ':joy: :one: ';
    const state = createEditorState(emojiMarkdown);
    const view = new EditorView({ state });
    view.dispatch({ selection: { anchor: state.doc.length } });
    const decorations = getDecorations(view);
    expect(decorations).toHaveLength(2);
  });

  const createEditorState = (doc: string) => {
    return EditorState.create({
      doc,
      extensions: [markdown({ base: markdownLanguage }), emojiPlugin],
    });
  };

  const getDecorations = (view: EditorView) => {
    const plugin = view.plugin(emojiPlugin);
    const decorations: { from: number; to: number; value: Decoration; }[] = [];
    if (plugin) {
      plugin.decorations.between(0, view.state.doc.length, (from, to, value) => {
        decorations.push({ from, to, value });
      });
    }
    return decorations;
  };
});
