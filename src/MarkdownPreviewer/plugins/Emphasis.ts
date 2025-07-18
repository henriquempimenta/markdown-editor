import { Decoration, DecorationSet, Range, ViewPlugin, ViewUpdate } from '@uiw/react-codemirror'
import { EditorView } from '@uiw/react-codemirror'
import { syntaxTree } from '@codemirror/language'


const EmphasisDecor = Decoration.mark({
  attributes: {
    style: "font-style: italic;"
  }
})

const StrongEmphasisDecor = Decoration.mark({
  attributes: {
    style: "font-weight: bold;"
  }
})

const StrikethroughDecor = Decoration.mark({
  attributes: {
    style: "text-decoration: line-through;"
  }
})

const SubscriptDecor = Decoration.mark({
  attributes: {
    style: "vertical-align: sub; font-size: smaller;"
  }
})

const SuperscriptDecor = Decoration.mark({
  attributes: {
    style: "vertical-align: super; font-size: smaller;"
  }
})


function Emphasis(view: EditorView) {
  const marks: Range<Decoration>[] = []
  for (const {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        switch (node.name) {
          case "Emphasis":
            marks.push(EmphasisDecor.range(node.from, node.to))
            break
          case "StrongEmphasis":
            marks.push(StrongEmphasisDecor.range(node.from, node.to))
            break
          case "Strikethrough":
            marks.push(StrikethroughDecor.range(node.from, node.to))
            break
          case "Subscript":
            marks.push(SubscriptDecor.range(node.from, node.to))
            break
          case "Superscript":
            marks.push(SuperscriptDecor.range(node.from, node.to))
            break
          default:
            // Ignore other nodes
            return;
        }
      },
    })
  }
  return Decoration.set(marks)
}

export const EmphasisPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = Emphasis(view)
  }

  update(update: ViewUpdate) {
    this.decorations = Emphasis(update.view)
  }

}, {
  decorations: instance => instance.decorations
})