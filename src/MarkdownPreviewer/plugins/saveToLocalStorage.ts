import { ViewPlugin, ViewUpdate } from '@uiw/react-codemirror'

export const saveToLocalStoragePlugin = ViewPlugin.fromClass(class {
  update(update: ViewUpdate) {
    if (update.docChanged) {
      localStorage.setItem('markdown', update.state.doc.toString())
    }
  }
})
