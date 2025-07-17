import { codeMonoPlugin, hideHeadersMarkersPlugin, hideMarkersPairsPlugin, resizeHeadersPlugin, latexRenderPlugin, latexHidePlugin as latexHidePlugin, syntaxTreeHierarchyPlugin, hideCodeMarkersPlugin, tableStylingPlugin as tableStylingPlugin, hideTablePlugin } from './plugins'
import CodeMirror, { EditorView, Extension } from '@uiw/react-codemirror';
import { languages } from '@codemirror/language-data'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { markdownMathSupport } from './markdownMathSupport';
import { lightTheme, darkTheme, EDITOR_VIEW_THEME } from './theme';
import './style.css'
import { useEffect, useState } from 'react';

const CODE_MIRROR_EXTENSIONS: Extension[] = [
  markdown({ base: markdownLanguage, extensions: [markdownMathSupport], codeLanguages: languages }),
  hideMarkersPairsPlugin,
  resizeHeadersPlugin,
  codeMonoPlugin,
  hideHeadersMarkersPlugin,
  latexRenderPlugin,
  latexHidePlugin,
  syntaxTreeHierarchyPlugin,
  hideCodeMarkersPlugin,
  tableStylingPlugin,
  hideTablePlugin,
];

export default function MarkdownPreview() {
  const [theme, setTheme] = useState(window.matchMedia('(prefers-color-scheme: light)').matches ? darkTheme : lightTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
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
      theme={theme}
      extensions={[
        ...CODE_MIRROR_EXTENSIONS,
        EditorView.lineWrapping,
        EDITOR_VIEW_THEME,
      ]}
    />
  );
}
