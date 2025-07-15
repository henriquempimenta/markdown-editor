import { Decoration, DecorationSet, Range, ViewPlugin, ViewUpdate } from '@uiw/react-codemirror'
import { EditorView } from '@uiw/react-codemirror'
import { syntaxTree } from '@codemirror/language'

const hideDecoration = Decoration.mark({
  attributes: {
    style: "display: none;"
  }
})

function hideCodeMarkers(view: EditorView) {
  const marks: Range<Decoration>[] = []
  const cursorPos = view.state.selection.main.head
  let inCodeBlock = false

  syntaxTree(view.state).iterate({
    from: 0,
    to: view.state.doc.length,
    enter: (node) => {
      if (node.name === "FencedCode" || node.name === "InlineCode") {
        if (cursorPos >= node.from && cursorPos <= node.to) {
          inCodeBlock = true
        }
      }

      if (!inCodeBlock && (node.name === "CodeMark" || node.name === "CodeInfo")) {
        marks.push(hideDecoration.range(node.from, node.to))
      }
    },
    leave: (node) => {
      if (node.name === "FencedCode" || node.name === "InlineCode") {
        inCodeBlock = false
      }
    }
  })

  return Decoration.set(marks)
}

export const hideCodeMarkersPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = hideCodeMarkers(view)
  }

  update(update: ViewUpdate) {
    this.decorations = hideCodeMarkers(update.view)
  }

}, {
  decorations: instance => instance.decorations
})