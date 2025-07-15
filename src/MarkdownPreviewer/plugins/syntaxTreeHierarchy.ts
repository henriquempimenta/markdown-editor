import { ViewPlugin, ViewUpdate } from '@uiw/react-codemirror'
import { EditorView } from '@uiw/react-codemirror'
import { syntaxTree } from '@codemirror/language'

/**
 * A function to extract the syntax tree hierarchy from a given editor view.
 *
 * @param {EditorView} view - The CodeMirror EditorView instance.
 * @returns {{ name: string, from: number, to: number, text: string }[]} An array of objects representing the syntax tree nodes.
 */
function syntaxTreeHierarchy(view: EditorView): { name: string; from: number; to: number; text: string }[] {
  const hierarchy: { name: string; from: number; to: number; text: string }[] = []
  for (const {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        hierarchy.push({
          name: node.type.name,
          from: node.from,
          to: node.to,
          text: view.state.doc.sliceString(node.from, node.to)
        })
      },
    })
  }
  return hierarchy
}

/**
 * A CodeMirror plugin that logs the syntax tree hierarchy of the editor content.
 */
export const syntaxTreeHierarchyPlugin = ViewPlugin.fromClass(class {
  /**
   * Initializes the plugin and performs an initial action on the editor view.
   *
   * @param {EditorView} view - The CodeMirror EditorView instance.
   */
  constructor(view: EditorView) {
    this.action(view)
  }

  /**
   * Extracts and logs the syntax tree hierarchy from the given editor view.
   *
   * @param {EditorView} view - The CodeMirror EditorView instance.
   */
  action(view: EditorView){
    const hierarchy = syntaxTreeHierarchy(view)
    console.log(hierarchy)
  }

  /**
   * Updates the plugin when the editor content changes.
   *
   * @param {ViewUpdate} update - An object containing information about the update.
   */
  update(update: ViewUpdate) {
    if (update.docChanged) {
      this.action(update.view)
    }
  }

})