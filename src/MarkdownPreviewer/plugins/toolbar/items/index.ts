import { type ToolbarSplit, type ToolbarSpace, type ToolbarItem } from '../types';
import { type Command } from '@codemirror/view';

export * from './basic-formatting';
export * from './headings';
export * from './lists';
export * from './media';

export const split: ToolbarSplit = {
    type: 'split',
};

export const space: ToolbarSpace = {
    type: 'space',
};

const fullScreenCommand: Command = (view) => {
    const editorWrapper = view.dom.closest('.cm-editor');
    if (editorWrapper) {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            editorWrapper.requestFullscreen();
        }
    }
    return true;
};

export const fullScreen: ToolbarItem = {
    icon: '<svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>',
    label: 'Full Screen',
    command: fullScreenCommand,
};