import { codeMonoPlugin, hideHeadersMarkersPlugin, hideMarkersPairsPlugin, resizeHeadersPlugin, latexRenderPlugin, latexHidePlugin as latexHidePlugin, syntaxTreeHierarchyPlugin, hideCodeMarkersPlugin, tableStylingPlugin as tableStylingPlugin, hideTablePlugin } from './plugins'
import CodeMirror, { EditorView, Extension } from '@uiw/react-codemirror';
import { languages } from '@codemirror/language-data'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { markdownMathSupport } from './markdownMathSupport';
import { theme, EDITOR_VIEW_THEME } from './theme';
import './style.css'

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
