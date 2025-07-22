import { type Command } from '@codemirror/view';
import { type ToolbarConfig, type ToolbarItem, type ToolbarSplit, type ToolbarSpace } from './types';

export function isToolbarItem(item: ToolbarItem | ToolbarSplit | ToolbarSpace): item is ToolbarItem {
    return !('type' in item);
}

export function createElement(config: ToolbarConfig, handlers: Record<string, Command>): HTMLDivElement {
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