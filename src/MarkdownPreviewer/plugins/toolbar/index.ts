import { type Command, EditorView, ViewPlugin, PluginValue } from '@codemirror/view';
import { type ToolbarConfig } from './types';
import { createElement } from './toolbar-builder';

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