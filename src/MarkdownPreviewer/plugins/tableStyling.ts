import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";

const monoFamily = Decoration.mark({
    attributes: {
        style: "font-family: monospace !important;"
    }
})

type Alignment = 'left' | 'center' | 'right';

class TableWidget extends WidgetType {
  constructor(readonly headers: string[], readonly rows: string[][], readonly alignments: Alignment[]) {
    super()
  }

  eq(other: TableWidget): boolean {
    if (other.headers.length !== this.headers.length || other.rows.length !== this.rows.length || other.alignments.join(',') !== this.alignments.join(',')) {
        return false;
    }
    if (other.headers.join(',') !== this.headers.join(',')) {
        return false;
    }
    for (let i = 0; i < this.rows.length; i++) {
        if (other.rows[i].join(',') !== this.rows[i].join(',')) {
            return false;
        }
    }
    return true;
  }

  toDOM(): HTMLElement {
    const table = document.createElement('table');
    table.className = "cm-html-table"; // For styling purposes

    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    for (let i = 0; i < this.headers.length; i++) {
        const th = document.createElement('th');
        th.textContent = this.headers[i];
        th.style.textAlign = this.alignments[i] || 'left';
        headerRow.appendChild(th);
    }

    const tbody = table.createTBody();
    for (const rowData of this.rows) {
        const row = tbody.insertRow();
        for (let i = 0; i < this.headers.length; i++) {
            const cell = row.insertCell();
            cell.textContent = rowData[i] || "";
            cell.style.textAlign = this.alignments[i] || 'left';
        }
    }

    return table;
  }

  ignoreEvent(): boolean {
    return false;
  }
}

function tableRender(view: EditorView): DecorationSet {
    const widgets: Range<Decoration>[] = [];
    const cursorPos = view.state.selection.main.head;
    const text = view.state.doc.toString();

    for (const { from, to } of view.visibleRanges) {
        syntaxTree(view.state).iterate({
            from,
            to,
            enter: (node) => {
                if (node.name !== "Table") {
                    return;
                }

                widgets.push(monoFamily.range(node.from, node.to));

                if (node.from <= cursorPos && cursorPos <= node.to) {
                    return;
                }

                const headers: string[] = [];
                const rows: string[][] = [];
                const alignments: Alignment[] = [];
                const tableNode = node.node;

                const headerNode = tableNode.getChild("TableHeader");
                if (headerNode) {
                    let cell = headerNode.firstChild;
                    while (cell) {
                        if (cell.name === "TableCell") {
                            headers.push(text.substring(cell.from, cell.to).trim());
                        }
                        cell = cell.nextSibling;
                    }
                }

                const delimiterNode = tableNode.getChild("TableDelimiter");
                if (delimiterNode) {
                    const delimiterText = text.substring(delimiterNode.from, delimiterNode.to);
                    const parts = delimiterText.split('|').map(s => s.trim()).filter(s => s.length > 0);
                    for (const part of parts) {
                        const left = part.startsWith(':');
                        const right = part.endsWith(':');
                        if (left && right) {
                            alignments.push('center');
                        } else if (right) {
                            alignments.push('right');
                        } else {
                            alignments.push('left');
                        }
                    }
                }


                let child = tableNode.firstChild;
                while (child) {
                    if (child.name === "TableRow") {
                        const row: string[] = [];
                        let cell = child.firstChild;
                        while (cell) {
                            if (cell.name === "TableCell") {
                                row.push(text.substring(cell.from, cell.to).trim());
                            }
                            cell = cell.nextSibling;
                        }
                        rows.push(row);
                    }
                    child = child.nextSibling;
                }

                const tableDecoration = Decoration.widget({
                    widget: new TableWidget(headers, rows, alignments),
                    side: 1,
                });
                widgets.push(tableDecoration.range(node.to));
            },
        });
    }

    return Decoration.set(widgets, true);
}


export const tableStylingPlugin = ViewPlugin.fromClass(class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = tableRender(view);
    }

    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged || update.selectionSet) {
            this.decorations = tableRender(update.view);
        }
    }
}, {
    decorations: instance => instance.decorations
});