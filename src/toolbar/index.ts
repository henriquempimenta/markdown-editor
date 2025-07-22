import { type Command, EditorView, ViewPlugin, PluginValue } from '@codemirror/view';
import { type ToolbarConfig, type ToolbarItem, type ToolbarSplit, type ToolbarSpace } from './types';

function isToolbarItem(item: ToolbarItem | ToolbarSplit | ToolbarSpace): item is ToolbarItem {
    return !('type' in item);
}

function createElement(config: ToolbarConfig, handlers: Record<string, Command>): HTMLDivElement {
    const element = document.createElement('div');
    element.classList.add('cm-toolbar');

    config.items.forEach((item, index) => {
        if (isToolbarItem(item)) {
            const button = document.createElement('button');
            button.classList.add('cm-toolbar-item');
            button.innerHTML = item.icon;
            button.setAttribute('aria-label', item.label);
            const key = item.key || (item.command as any).displayName || item.command?.name || `cmd_${index}`;
            button.dataset.item = key;
            handlers[key] = item.command;
            element.appendChild(button);
        } else if (item.type === 'split') {
            const split = document.createElement('div');
            split.classList.add('cm-toolbar-split');
            element.appendChild(split);
        } else if (item.type === 'space') {
            const space = document.createElement('div');
            space.classList.add('cm-toolbar-space');
            element.appendChild(space);
        }
    });

    return element;
}

export class ToolbarPlugin implements PluginValue {
    private readonly element: HTMLDivElement;
    protected readonly config: ToolbarConfig;
    protected readonly handlers: Record<string, Command> = {};

    constructor(private readonly view: EditorView, config: ToolbarConfig) {
        this.config = config;
        const element = this.element = createElement(this.config, this.handlers);
        element.addEventListener('click', this.handleClick.bind(this));
        this.view.dom.prepend(element);
    }

    private handleClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (target && target.tagName === 'BUTTON') {
            const cmd = target.dataset.item;
            if (cmd) {
                const command = this.handlers[cmd];
                if (command) {
                    e.preventDefault();
                    e.stopPropagation();
                    command(this.view);
                    return;
                }
            }
        }
        this.view.focus();
    }

    destroy() {
        this.element.remove();
    }
}

export const toolbar = (config: ToolbarConfig) => {
    return ViewPlugin.define(view => new ToolbarPlugin(view, config));
};