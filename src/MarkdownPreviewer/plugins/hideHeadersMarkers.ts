import { Decoration, DecorationSet, Range, ViewPlugin, ViewUpdate } from '@uiw/react-codemirror'
import { EditorView } from '@uiw/react-codemirror'
import { syntaxTree } from '@codemirror/language'

const hideBlue = Decoration.mark({
  attributes: {
    style: "background-color: blue !important; display: none;"
  }
})

function hideHeadersMarkers(view: EditorView) {
  const marks: Range<Decoration>[] = []
  const dont: (number | undefined)[] = []
  const cursorPos = view.state.selection.main.head
  
  const node = syntaxTree(view.state).resolve(cursorPos, 1)
  const ATXHorMark = (node.name.startsWith("ATXHeading") || node.name == "HeaderMark" )?
    node: null

  if (ATXHorMark !== null) {  
    const mark = (ATXHorMark.name.startsWith("ATXHeading")) ?
      ATXHorMark.getChild("HeaderMark") : ATXHorMark
    dont.push(mark?.from)
  }

  for (const {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter(node) {
        if (node.name == "HeaderMark" && !dont.includes(node.from)) {
          marks.push(hideBlue.range(node.from, node.to + 1))
        }
      },
    })
  }

  return Decoration.set(marks)
}

export const hideHeadersMarkersPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = hideHeadersMarkers(view)
  }

  update(update: ViewUpdate) {
    this.decorations = hideHeadersMarkers(update.view)
  }

}, {
  decorations: instance => instance.decorations
})