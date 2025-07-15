import { Decoration, DecorationSet, Range, ViewPlugin, ViewUpdate } from '@uiw/react-codemirror'
import { EditorView } from '@uiw/react-codemirror'
import { syntaxTree } from '@codemirror/language'

const LATEX_TAGS = ["InlineMathDollar", "InlineMathBracket", "BlockMathDollar", "BlockMathBracket"]

const hideRed = Decoration.mark({
  attributes: {
    style: "background-color: red !important; display: none;"
  }
})

function latexHide(view: EditorView) {
  const marks: Range<Decoration>[] = []
  const cursorPos = view.state.selection.main.head
  for (const {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        if (!LATEX_TAGS.includes(node.type.name)) {
          return
        }
        if ((node.from <= cursorPos && cursorPos <= node.to)) {
          return
        }
        marks.push(
          hideRed.range(node.from, node.to)
        )
      },
    })
  }
  return Decoration.set(marks)
}

export const latexHidePlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = latexHide(view)
  }

  update(update: ViewUpdate) {
    this.decorations = latexHide(update.view)
  }

}, {
  decorations: instance => instance.decorations
})