import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { EditorView } from '@uiw/react-codemirror'
import { codeMonoPlugin, hideHeadersMarkersPlugin, hidePlugin, resizeHeadersPlugin } from './plugins'
import './style.css'

export default function MarkdownPreview() {
  return (
    <CodeMirror
      extensions={[
        markdown({ base: markdownLanguage }),
        hidePlugin,
        resizeHeadersPlugin,
        codeMonoPlugin,
        hideHeadersMarkersPlugin,
        EditorView.lineWrapping,
        EditorView.theme({
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
        }),
      ]}
      />
  )
}