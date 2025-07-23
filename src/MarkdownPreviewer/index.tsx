import { codeMonoPlugin, hideMarkersPlugin, resizeHeadersPlugin, latexRenderPlugin, latexPreviewPlugin, syntaxTreeHierarchyPlugin, hideCodeMarkersPlugin, tableStylingPlugin as tableStylingPlugin, hideTablePlugin, EmphasisPlugin, emojiPlugin, taskListPlugin, saveToLocalStoragePlugin, imagePlugin, horizontalRulePlugin } from './plugins'
import CodeMirror, { EditorView, Extension } from '@uiw/react-codemirror';
import { EditorSelection, ChangeSpec } from '@codemirror/state';
import { toolbar } from './plugins/toolbar';
import * as Items from './plugins/toolbar/items';
import { bold, italic, strike, underline } from './plugins/toolbar/items/basic-formatting';
import { h1, h2, h3, h4, h5, h6 } from './plugins/toolbar/items/headings';
import { quote, ul, ol, todo } from './plugins/toolbar/items/lists';
import { link, image } from './plugins/toolbar/items/media';
import { languages } from '@codemirror/language-data'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { markdownMathSupport } from './markdownMathSupport';
import { lightTheme, darkTheme, EDITOR_VIEW_THEME } from './theme';
import './style.css'
import './plugins/toolbar/toolbar.css';
import { useEffect, useState } from 'react';

const CODE_MIRROR_EXTENSIONS: Extension[] = [
  markdown({ base: markdownLanguage, extensions: [markdownMathSupport], codeLanguages: languages }),
  hideMarkersPlugin,
  resizeHeadersPlugin,
  codeMonoPlugin,
  latexRenderPlugin,
  latexPreviewPlugin,
  syntaxTreeHierarchyPlugin,
  hideCodeMarkersPlugin,
  tableStylingPlugin,
  hideTablePlugin,
  EmphasisPlugin,
  emojiPlugin,
  taskListPlugin,
  saveToLocalStoragePlugin,
  imagePlugin,
  horizontalRulePlugin,
  toolbar({
    items: [
      bold,
      italic,
      strike,
      underline,
      Items.split,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      Items.split,
      quote,
      ul,
      ol,
      todo,
      Items.split,
      link,
      {
        ...image,
        command: (view: EditorView) => {
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
        }
      },
      Items.space,
      Items.fullScreen,
    ],
  }),
];

export default function MarkdownPreview({ doc }: { doc: string }) {
  const [theme, setTheme] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? darkTheme : lightTheme);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return (
    <CodeMirror
      value={doc}
      theme={theme}
      extensions={[
        ...CODE_MIRROR_EXTENSIONS,
        EditorView.lineWrapping,
        EDITOR_VIEW_THEME,
      ]}
    />
  );
}
