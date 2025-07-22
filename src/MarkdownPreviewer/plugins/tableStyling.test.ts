import { EditorState } from '@codemirror/state';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { tableStylingPlugin } from './tableStyling';
import { Decoration, EditorView } from '@codemirror/view';
import { describe, it, expect } from 'vitest';

describe('tableStylingPlugin', () => {
  it('should correctly parse and style a markdown table', () => {
    const tableMarkdown = `
| Item              | In Stock | Price |
| :---------------- | :------: | ----: |
| Python Hat        |   True   | 23.99 |
| SQL Hat           |   True   | 23.99 |
| Codecademy Tee    |  False   | 19.99 |
| Codecademy Hoodie |  False   | 42.99 |
    `;
    const state = createEditorState(tableMarkdown);
    const decorations = getDecorations(state);

    // We expect one decoration for the monospace font and one for the table widget.
    expect(decorations).toHaveLength(2);

    const widgetDecoration = decorations.find(d => d.value.spec.widget);
    expect(widgetDecoration).toBeDefined();

    const tableWidget = widgetDecoration?.value.spec.widget;
    expect(tableWidget).toBeDefined();

    const expectedHeaders = ['Item', 'In Stock', 'Price'];
    const expectedRows = [
      ['Python Hat', 'True', '23.99'],
      ['SQL Hat', 'True', '23.99'],
      ['Codecademy Tee', 'False', '19.99'],
      ['Codecademy Hoodie', 'False', '42.99'],
    ];
    const expectedAlignments = ['left', 'center', 'right'];

    expect(tableWidget.headers).toEqual(expectedHeaders);
    expect(tableWidget.rows).toEqual(expectedRows);
    expect(tableWidget.alignments).toEqual(expectedAlignments);
  });

  const createEditorState = (doc: string) => {
    return EditorState.create({
      doc,
      extensions: [markdown({ base: markdownLanguage }), tableStylingPlugin],
    });
  };

  const getDecorations = (state: EditorState) => {
    const view = new EditorView({ state });
    const plugin = view.plugin(tableStylingPlugin);
    const decorations: { from: number; to: number; value: Decoration; }[] = [];
    if (plugin) {
      plugin.decorations.between(0, state.doc.length, (from, to, value) => {
        decorations.push({ from, to, value });
      });
    }
    return decorations;
  };
});
