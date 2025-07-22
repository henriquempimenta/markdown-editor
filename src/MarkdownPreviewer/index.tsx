import { codeMonoPlugin, hideHeadersMarkersPlugin, hideMarkersPlugin, resizeHeadersPlugin, latexRenderPlugin, latexPreviewPlugin, syntaxTreeHierarchyPlugin, hideCodeMarkersPlugin, tableStylingPlugin as tableStylingPlugin, hideTablePlugin, EmphasisPlugin, emojiPlugin, taskListPlugin, saveToLocalStoragePlugin } from './plugins'
import CodeMirror, { EditorView, Extension } from '@uiw/react-codemirror';
import { languages } from '@codemirror/language-data'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { markdownMathSupport } from './markdownMathSupport';
import { lightTheme, darkTheme, EDITOR_VIEW_THEME } from './theme';
import './style.css'
import { useEffect, useState } from 'react';

const CODE_MIRROR_EXTENSIONS: Extension[] = [
  markdown({ base: markdownLanguage, extensions: [markdownMathSupport], codeLanguages: languages }),
  hideMarkersPlugin,
  resizeHeadersPlugin,
  codeMonoPlugin,
  hideHeadersMarkersPlugin,
  latexRenderPlugin,
  latexPreviewPlugin,
  syntaxTreeHierarchyPlugin,
  hideCodeMarkersPlugin,
  tableStylingPlugin,
  hideTablePlugin,
  EmphasisPlugin,
  emojiPlugin,
  taskListPlugin,
  saveToLocalStoragePlugin
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
