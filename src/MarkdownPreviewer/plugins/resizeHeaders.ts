import { Decoration, DecorationSet, Range, ViewPlugin, ViewUpdate } from '@uiw/react-codemirror'
import { EditorView } from '@uiw/react-codemirror'
import { syntaxTree } from '@codemirror/language'

/**
 * The colors are for debug only
 */
const hideBlue = Decoration.mark({
  attributes: {
    style: "background-color: blue !important; display: none;"
  }
})

const headerN = (n: number) => Decoration.mark({
  attributes: {
    style: `font-size: ${2 - (1/5)*(n - 1)}em`
  }
})

function resizeHeaders(view: EditorView) {
  const marks: Range<Decoration>[] = []
  const cursorPos = view.state.selection.main.head
  for (const {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter(node) {
        if (!node.name.startsWith("ATXHeading")) {
          return
        }

        const ATXHorMark = node.node.getChild("HeaderMark")

        if (ATXHorMark && !(node.from <= cursorPos && cursorPos <= node.to)) {
          marks.push(hideBlue.range(ATXHorMark.from, ATXHorMark.to + 1))
        }

        const temp = node.name.match(/\d{1}/)?.[0]
        let n = 6

        if (typeof temp === 'string') {
          n = parseInt(temp)
        }

        marks.push(
          headerN(n).range(node.from, node.to)
        )
      },
    })
  }
  return Decoration.set(marks)
}

export const resizeHeadersPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = resizeHeaders(view)
  }

  update(update: ViewUpdate) {
    this.decorations = resizeHeaders(update.view)
  }

}, {
  decorations: instance => instance.decorations
})