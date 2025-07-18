import { Decoration, DecorationSet, Range, ViewPlugin, ViewUpdate, WidgetType } from '@uiw/react-codemirror'
import { DELIMITER_LENGTH } from '../markdownMathSupport'
import { EditorView } from '@uiw/react-codemirror'
import { syntaxTree } from '@codemirror/language'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const LATEX_TAGS = ["InlineMathDollar", "InlineMathBracket", "BlockMathDollar", "BlockMathBracket"]

class LatexPreviewWidget extends WidgetType {
  constructor(readonly math: string, readonly displayMode: boolean = false){
    super()
  }

  eq(other: LatexPreviewWidget) {
    return other.math === this.math
  }

  toDOM(): HTMLElement {
    const span = document.createElement('span')
    span.className = 'cm-latex-preview'
    try {
      katex.render(this.math, span, {
        throwOnError: false,
        output: 'html',
        displayMode: this.displayMode
      })
    } catch (e) {
      console.error(e)
    }
    return span
  }

  ignoreEvent() {
    return false
  }
}

function latexPreviewRender(view: EditorView) {
  const widgets: Range<Decoration>[] = []
  const text = view.state.doc.toString()
  const cursorPos = view.state.selection.main.head
  for (const {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        if (LATEX_TAGS.includes(node.type.name) && (node.from <= cursorPos && cursorPos <= node.to)) {
            const math = text.substring(
                node.from + DELIMITER_LENGTH[node.type.name],
                node.to - DELIMITER_LENGTH[node.type.name]
            )
            const isBlock = node.type.name.startsWith('Block')
            const latexPreviewDecoration = Decoration.widget({
                widget: new LatexPreviewWidget(math, isBlock),
                side: 1
            })
            widgets.push(latexPreviewDecoration.range(node.to))
        }
      }
    })
  }
  return Decoration.set(widgets)
}

export const latexPreviewPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = latexPreviewRender(view)
  }

  update(update: ViewUpdate) {
    this.decorations = latexPreviewRender(update.view)
  }
}, {
  decorations: instance => instance.decorations
})