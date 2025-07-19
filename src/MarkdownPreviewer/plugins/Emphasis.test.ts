import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { EmphasisPlugin } from './Emphasis';
import { Decoration, EditorView } from '@codemirror/view';
import { describe, it, expect } from 'vitest';

describe('EmphasisPlugin', () => {
  const createEditorState = (doc: string) => {
    return EditorState.create({
      doc,
      extensions: [markdown(), EmphasisPlugin],
    });
  };

  const getDecorations = (state: EditorState) => {
    const view = new EditorView({ state });
    const plugin = view.plugin(EmphasisPlugin);
    const decorations: { from: number; to: number; value: Decoration; }[] = [];
    if (plugin) {
      plugin.decorations.between(0, state.doc.length, (from, to, value) => {
        decorations.push({ from, to, value });
      });
    }
    return decorations;
  };

  it('should handle ***strong emph***', () => {
    const state = createEditorState('***strong emph***');
    const decorations = getDecorations(state);
    expect(decorations).toHaveLength(2);
    const styles = decorations.map(d => d.value.spec.attributes.style);
    expect(styles).toContain('font-style: italic;');
    expect(styles).toContain('font-weight: bold;');
  });

  it('should handle ***strong** in emph*', () => {
    const state = createEditorState('***strong** in emph*');
    const decorations = getDecorations(state);
    expect(decorations).toHaveLength(2);
    const styles = decorations.map(d => d.value.spec.attributes.style);
    expect(styles).toContain('font-style: italic;');
    expect(styles).toContain('font-weight: bold;');
  });

  it('should handle ***emph* in strong**', () => {
    const state = createEditorState('***emph* in strong**');
    const decorations = getDecorations(state);
    expect(decorations).toHaveLength(2);
    const styles = decorations.map(d => d.value.spec.attributes.style);
    expect(styles).toContain('font-style: italic;');
    expect(styles).toContain('font-weight: bold;');
  });

  it('should handle **in strong *emph***', () => {
    const state = createEditorState('**in strong *emph***');
    const decorations = getDecorations(state);
    expect(decorations).toHaveLength(2);
    const styles = decorations.map(d => d.value.spec.attributes.style);
    expect(styles).toContain('font-style: italic;');
    expect(styles).toContain('font-weight: bold;');
  });

  it('should handle *in emph **strong***', () => {
    const state = createEditorState('*in emph **strong***');
    const decorations = getDecorations(state);
    expect(decorations).toHaveLength(2);
    const styles = decorations.map(d => d.value.spec.attributes.style);
    expect(styles).toContain('font-style: italic;');
    expect(styles).toContain('font-weight: bold;');
  });
});
