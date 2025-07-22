import { Decoration, DecorationSet, Range, ViewPlugin, ViewUpdate, WidgetType } from '@uiw/react-codemirror'
import { EditorView } from '@uiw/react-codemirror'
import { syntaxTree } from '@codemirror/language'

class ImageWidget extends WidgetType {
  constructor(readonly url: string) {
    super()
  }

  eq(other: ImageWidget) {
    return other.url === this.url
  }

  toDOM() {
    const container = document.createElement('div')
    container.style.padding = '10px 0'
    const img = document.createElement('img')
    img.src = this.url
    img.style.maxWidth = '100%'
    img.style.display = 'block'
    img.style.margin = '0 auto'
    container.appendChild(img)
    return container
  }
}

const hide = Decoration.mark({
  attributes: {
    style: "display: none;"
  }
})

function image(view: EditorView) {
  const widgets: Range<Decoration>[] = []
  const cursorPos = view.state.selection.main.head
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        if (node.name === 'Image') {
          const inside = node.from <= cursorPos && cursorPos <= node.to
          const urlNode = node.node.getChild('URL')
          const url = urlNode ? view.state.doc.sliceString(urlNode.from, urlNode.to) : ''

          let child = node.node.firstChild
          if (!inside && url){
            while (child) {
              widgets.push(hide.range(child.from, child.to))
              child = child.nextSibling
            }
          }

          if (url) {
            const deco = Decoration.widget({
              widget: new ImageWidget(url),
            })
            widgets.push(deco.range(node.to))
          }
        }
      },
    })
  }
  return Decoration.set(widgets, true)
}

export const imagePlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = image(view)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged || update.selectionSet) {
      this.decorations = image(update.view)
    }
  }
}, {
  decorations: v => v.decorations
})