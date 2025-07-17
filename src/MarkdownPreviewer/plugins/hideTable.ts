import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";

/**
 * The colors are for debug only
 */
const hideOrange = Decoration.mark({
    attributes: {
        style: "background-color: orange !important; display: none;"
    }
})

function hideTable(view: EditorView): DecorationSet {
    const marks: Range<Decoration>[] = [];
    const cursorPos = view.state.selection.main.head;

    for (const { from, to } of view.visibleRanges) {
        syntaxTree(view.state).iterate({
            from,
            to,
            enter: (node) => {
                if (node.name !== "Table") {
                    return;
                }

                if (node.from <= cursorPos && cursorPos <= node.to) {
                    return;
                }
                
                marks.push(hideOrange.range(node.from, node.to));
            },
        });
    }

    return Decoration.set(marks, true);
}


export const hideTablePlugin = ViewPlugin.fromClass(class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = hideTable(view);
    }

    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged || update.selectionSet) {
            this.decorations = hideTable(update.view);
        }
    }
}, {
    decorations: instance => instance.decorations
});