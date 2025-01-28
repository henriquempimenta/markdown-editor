import { Decoration, DecorationSet, Range, ViewPlugin, ViewUpdate, WidgetType } from '@uiw/react-codemirror'
import { DELIMITER_LENGTH } from './markdownMathSupport'
import { EditorView } from '@uiw/react-codemirror'
import { syntaxTree } from '@codemirror/language'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const hideRed = Decoration.mark({
  attributes: {
    style: "background-color: red !important; display: none;"
  }
})

const hideBlue = Decoration.mark({
  attributes: {
    style: "background-color: blue !important; display: none;"
  }
})

const monoFamily = Decoration.mark({
  attributes: {
    style: "font-family: monomonospace, monospace !important;"
  }
})

const headerN = (n: number) => Decoration.mark({
  attributes: {
    style: `font-size: ${2 - (1/5)*(n - 1)}em`
  }
})

type liteNode = {
  name: string,
  from: number,
  to: number
}

//////////////////////////////////////////////
// BEGIN: Latex Render Plugin
//////////////////////////////////////////////

const LATEX_TAGS = ["InlineMathDollar", "InlineMathBracket", "BlockMathDollar", "BlockMathBracket"]

class LatetWidget extends WidgetType {
  constructor(readonly math: string, readonly displayMode: boolean = false){
    super()
  }

  eq(other: LatetWidget) {
    return other.math === this.math
  }

  toDOM(): HTMLElement {
    const span = document.createElement('span')
    try {
      katex.render(this.math, span, {
        throwOnError: false,
        output: 'html',
        displayMode: this.displayMode
      })
    } catch (e) {
      console.error(e)
    }
    return span
  }

  ignoreEvent() {
    return false
  }
}

function latexRender(view: EditorView) {
  const widgets: Range<Decoration>[] = []
  const text = view.state.doc.toString()
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
        const math = text.substring(
          node.from + DELIMITER_LENGTH[node.type.name],
          node.to - DELIMITER_LENGTH[node.type.name]
        )
        const latexDecoration = Decoration.widget({
            widget: new LatetWidget(math, node.type.name.startsWith("Block")),
            side: 1
          })
        widgets.push(latexDecoration.range(node.to))
      }
    })
  }
  return Decoration.set(widgets)
}

export const latexRenderPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = latexRender(view)
  }

  update(update: ViewUpdate) {
    this.decorations = latexRender(update.view)
  }
}, {
  decorations: instance => instance.decorations
})

//////////////////////////////////////////////
// END: Latex Render Plugin
//////////////////////////////////////////////


//////////////////////////////////////////////
// BEGIN: Latex Hide Plugin
//////////////////////////////////////////////

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


//////////////////////////////////////////////
// END: Latex Hide Plugin
//////////////////////////////////////////////


//////////////////////////////////////////////
// BEGIN: SyntaxTree Hierarchy Plugin
//////////////////////////////////////////////

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

//////////////////////////////////////////////
// END: SyntaxTree Hierarchy Plugin
//////////////////////////////////////////////


function resizeHeaders(view: EditorView) {
  const marks: Range<Decoration>[] = []
  for (const {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter(node) {
        if (!node.name.startsWith("ATXHeading")) {
          return
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

function hideMarkersPairs(view: EditorView) {
  const marks: Range<Decoration>[] = []
  let nodeBefore: liteNode | null = null
  const cursorPos = view.state.selection.main.head
  for (const {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        if (!node.name.endsWith("Mark")) {
          return
        }
        if (nodeBefore == null) {
          return
        }
        if (nodeBefore.name !== node.name) {
          return
        }
        if ((nodeBefore.from <= cursorPos && cursorPos <= node.to)) {
          return
        }
        if (nodeBefore.from == node.to) {
          return
        }

        marks.push(
          hideBlue.range(nodeBefore.from, nodeBefore.to),
          hideRed.range(node.from, node.to)
        )
      },
      leave(node) {
        nodeBefore = structuredClone({name: node.name, from: node.from, to: node.to})
      },
    })
  }
  return Decoration.set(marks)
}

export const hideMarkersPairsPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = hideMarkersPairs(view)
  }

  update(update: ViewUpdate) {
    this.decorations = hideMarkersPairs(update.view)
  }

}, {
  decorations: instance => instance.decorations
})

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