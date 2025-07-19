import { Decoration, DecorationSet, Range, ViewPlugin, ViewUpdate, WidgetType } from '@uiw/react-codemirror'
import { EditorView } from '@uiw/react-codemirror'
import { syntaxTree } from '@codemirror/language'

class TaskListWidget extends WidgetType {
  constructor(readonly checked: boolean, readonly pos: number) {
    super()
  }

  eq(other: TaskListWidget) {
    return other.checked === this.checked && other.pos === this.pos
  }

  toDOM(view: EditorView): HTMLElement {
    const wrapper = document.createElement('span')
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.checked = this.checked
    input.className = 'cm-task-list-checkbox'
    input.onchange = () => {
      const newText = input.checked ? '[x]' : '[ ]'
      view.dispatch({
        changes: { from: this.pos, to: this.pos + 3, insert: newText }
      })
    }
    wrapper.appendChild(input)
    return wrapper
  }

  ignoreEvent() {
    return false
  }
}

function taskListDecorations(view: EditorView) {
  const widgets: Range<Decoration>[] = []
  const cursorPos = view.state.selection.main.head
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        if (node.type.name === 'Task') {
          const taskMarker = node.node.getChild('TaskMarker')
          if (taskMarker && !(taskMarker.from <= cursorPos && cursorPos <= taskMarker.to)) {
            const text = view.state.doc.sliceString(taskMarker.from, taskMarker.to)
            const checked = text.includes('x') || text.includes('X')
            const deco = Decoration.replace({
              widget: new TaskListWidget(checked, taskMarker.from),
            })
            widgets.push(deco.range(taskMarker.from, taskMarker.to))
          }
        }
      }
    })
  }
  return Decoration.set(widgets)
}

export const taskListPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = taskListDecorations(view)
  }

  update(update: ViewUpdate) {
    this.decorations = taskListDecorations(update.view)
  }
}, {
  decorations: v => v.decorations
})
