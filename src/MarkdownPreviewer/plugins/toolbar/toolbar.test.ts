import { EditorState } from '@codemirror/state';
import { EditorView, Extension } from '@codemirror/view';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { describe, it, expect, beforeEach } from 'vitest';
import { toolbar } from '../toolbar';
import { bold } from './items/basic-formatting';

describe('Toolbar click handling', () => {
  let view: EditorView;

  const createEditorView = (doc: string, extensions: Extension[] = []) => {
    const state = EditorState.create({
      doc,
      extensions: [
        markdown({ base: markdownLanguage }),
        toolbar({
          items: [bold],
        }),
        ...extensions,
      ],
    });
    view = new EditorView({ state });
    document.body.appendChild(view.dom);
    return view;
  };

  beforeEach(() => {
    if (view && view.dom.parentNode) {
      view.dom.parentNode.removeChild(view.dom);
    }
  });

  it('should apply bold formatting when the bold button is clicked', () => {
    const initialDoc = 'hello world';
    const editorView = createEditorView(initialDoc);

    // Set selection to 'world'
    editorView.dispatch({ selection: { anchor: 6, head: 11 } });

    // Simulate click on the bold button
    const boldButton = editorView.dom.querySelector('[data-item="boldCommand"]') as HTMLButtonElement;
    expect(boldButton).not.toBeNull();
    boldButton.click();

    expect(editorView.state.doc.toString()).toBe('hello **world**');
  });

  it('should insert bold markdown at cursor position if no text is selected', () => {
    const initialDoc = 'hello world';
    const editorView = createEditorView(initialDoc);

    // Set cursor position
    editorView.dispatch({ selection: { anchor: 6, head: 6 } });

    // Simulate click on the bold button
    const boldButton = editorView.dom.querySelector('[data-item="boldCommand"]') as HTMLButtonElement;
    expect(boldButton).not.toBeNull();
    boldButton.click();

    expect(editorView.state.doc.toString()).toBe('hello ****world');
  });
});