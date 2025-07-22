import { type Command } from '@codemirror/view';

export interface ToolbarConfig {
    items: Array<ToolbarItem | ToolbarSplit | ToolbarSpace>;
}

export type ToolbarItem = {
    icon: string;
    label: string;
    command: Command;
    key?: string;
}

export type ToolbarSplit = {
    type: 'split';
}

export type ToolbarSpace = {
    type: 'space';
}
