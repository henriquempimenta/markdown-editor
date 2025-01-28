import { codeMonoPlugin, hideHeadersMarkersPlugin, hideMarkersPairsPlugin, resizeHeadersPlugin, latexRenderPlugin, latexHidePlugin as latexHidePlugin } from './plugins'
import CodeMirror, { EditorView, Extension } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { markdownMathSupport } from './markdownMathSupport';
import './style.css'

const CODE_MIRROR_EXTENSIONS: Extension[] = [
  markdown({ base: markdownLanguage, extensions: markdownMathSupport }),
  hideMarkersPairsPlugin,
  resizeHeadersPlugin,
  codeMonoPlugin,
  hideHeadersMarkersPlugin,
  latexRenderPlugin,
  latexHidePlugin,
];

const EDITOR_VIEW_THEME: Extension = EditorView.theme({
  '.cm-scroller': {
    overflow: 'hidden',
    fontFamily: '"Roboto", sans-serif',
  },
  '.cm-lineNumbers': {
    display: 'none',
  },
  '.cm-gutters': {
    display: 'none',
  },
  '.cm-activeLine': {
    backgroundColor: 'unset',
  },
});

export default function MarkdownPreview() {
  return (
    <CodeMirror
      extensions={[
        ...CODE_MIRROR_EXTENSIONS,
        EditorView.lineWrapping,
        EDITOR_VIEW_THEME,
      ]}
    />
  );
}