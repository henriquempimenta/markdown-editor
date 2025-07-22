import { EditorState } from '@codemirror/state';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { imagePlugin } from './image';
import { Decoration, EditorView } from '@codemirror/view';
import { describe, it, expect } from 'vitest';

describe('imagePlugin', () => {
  const imageMarkdown = '![alt text](https://via.placeholder.com/150)';

  it('should correctly parse and display a markdown image', () => {
    const state = createEditorState(imageMarkdown);
    const decorations = getDecorations(state);

    expect(decorations).toHaveLength(1);

    const widgetDecoration = decorations.find(d => d.value.spec.widget);
    expect(widgetDecoration).toBeDefined();

    const imageWidget = widgetDecoration?.value.spec.widget;
    expect(imageWidget).toBeDefined();

    expect(imageWidget.url).toEqual('https://via.placeholder.com/150');
  });

  it('should show all decorations when cursor is outside the image', () => {
    const state = createEditorState(imageMarkdown + ' ');
    const view = new EditorView({ state });
    view.dispatch({ selection: { anchor: state.doc.length } });
    const plugin = view.plugin(imagePlugin);
    const decorations: { from: number; to: number; value: Decoration; }[] = [];
    if (plugin) {
      plugin.decorations.between(0, state.doc.length, (from, to, value) => {
        decorations.push({ from, to, value });
      });
    }
    expect(decorations).toHaveLength(6);
  });

  const createEditorState = (doc: string) => {
    return EditorState.create({
      doc,
      extensions: [markdown({ base: markdownLanguage }), imagePlugin],
    });
  };

  const getDecorations = (state: EditorState) => {
    const view = new EditorView({ state });
    const plugin = view.plugin(imagePlugin);
    const decorations: { from: number; to: number; value: Decoration; }[] = [];
    if (plugin) {
      plugin.decorations.between(0, state.doc.length, (from, to, value) => {
        decorations.push({ from, to, value });
      });
    }
    return decorations;
  };
});