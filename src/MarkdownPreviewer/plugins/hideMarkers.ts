import { Decoration, DecorationSet, Range, ViewPlugin, ViewUpdate } from '@uiw/react-codemirror'
import { EditorView } from '@uiw/react-codemirror'
import { syntaxTree } from '@codemirror/language'


/**
 * The colors are for debug only
 */
const hideRed = Decoration.mark({
  attributes: {
    style: "background-color: red !important; display: none;"
  }
})

const EnphasisTypes = ["Emphasis", "StrongEmphasis", "Strikethrough", "Subscript", "Superscript"]

function hideMarkers(view: EditorView) {
  const marks: Range<Decoration>[] = []
  const cursorPos = view.state.selection.main.head
  for (const {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        if (!EnphasisTypes.includes(node.name)) {
          return
        }

        if ((node.from <= cursorPos && cursorPos <= node.to)) {
          return
        }

        const enphasisNode = node.node
        let child = enphasisNode.firstChild

        while (child) {
          if (child.name.endsWith("Mark")) {
            marks.push(
              hideRed.range(child.from, child.to)
            )
          }
          child = child.nextSibling
        }
      },
    })
  }
  return Decoration.set(marks)
}

export const hideMarkersPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = hideMarkers(view)
  }

  update(update: ViewUpdate) {
    this.decorations = hideMarkers(update.view)
  }

}, {
  decorations: instance => instance.decorations
})