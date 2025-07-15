import { Decoration, DecorationSet, Range, ViewPlugin, ViewUpdate } from '@uiw/react-codemirror'
import { EditorView } from '@uiw/react-codemirror'
import { syntaxTree } from '@codemirror/language'

const monoFamily = Decoration.mark({
  attributes: {
    style: "font-family: monomonospace, monospace !important;"
  }
})

function codeMono(view: EditorView) {
  const marks: Range<Decoration>[] = []
  for (const {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        if (!['FencedCode', 'CodeText', 'InlineCode'].includes(node.name)) {
          return
        }
        if (node)
        marks.push(monoFamily.range(node.from, node.to))
      },
    })
  }
  return Decoration.set(marks)
}

export const codeMonoPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = codeMono(view)
  }

  update(update: ViewUpdate) {
    this.decorations = codeMono(update.view)
  }

}, {
  decorations: instance => instance.decorations
})