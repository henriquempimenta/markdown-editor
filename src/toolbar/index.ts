import { EditorView, ViewPlugin, PluginValue } from '@codemirror/view';
import { type ToolbarConfig, type ToolbarItem } from './types';

class ToolbarView implements PluginValue {
    public dom: HTMLElement;

    constructor(private view: EditorView, private config: ToolbarConfig) {
        this.dom = document.createElement('div');
        this.dom.classList.add('cm-toolbar');

        this.renderItems();
    }

    private renderItems() {
        this.config.items.forEach(item => {
            if ('type' in item) {
                if (item.type === 'split') {
                    const split = document.createElement('div');
                    split.classList.add('cm-toolbar-split');
                    this.dom.appendChild(split);
                } else if (item.type === 'space') {
                    const space = document.createElement('div');
                    space.classList.add('cm-toolbar-space');
                    this.dom.appendChild(space);
                }
            } else {
                const button = document.createElement('button');
                button.classList.add('cm-toolbar-item');
                button.innerHTML = item.icon;
                button.setAttribute('aria-label', item.label);
                button.onclick = () => item.command(this.view);
                this.dom.appendChild(button);
            }
        });
    }

    update(update: { view: EditorView; }) {
        // For now, we don't need to update the toolbar on every view update.
    }

    destroy() {
        this.dom.remove();
    }
}

export const toolbar = (config: ToolbarConfig) => {
    return ViewPlugin.define(
        (view) => new ToolbarView(view, config),
        {
            decorations: () => {
                return null as any;
            },
        }
    );
};
