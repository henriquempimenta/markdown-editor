import { type Command } from '@codemirror/view';
import { type ToolbarItem } from '../types';

const boldCommand: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '**' },
            { from: range.to, insert: '**' },
        ],
        range: range,
    })));
    return true;
};

export const bold: ToolbarItem = {
    icon: '<b>B</b>',
    label: 'Bold',
    command: boldCommand,
};

const italicCommand: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '*' },
            { from: range.to, insert: '*' },
        ],
        range: range,
    })));
    return true;
};

export const italic: ToolbarItem = {
    icon: '<i>I</i>',
    label: 'Italic',
    command: italicCommand,
};

const strikeCommand: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '~~' },
            { from: range.to, insert: '~~' },
        ],
        range: range,
    })));
    return true;
};

export const strike: ToolbarItem = {
    icon: '<s>S</s>',
    label: 'Strike',
    command: strikeCommand,
};

const underlineCommand: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '<u>' },
            { from: range.to, insert: '</u>' },
        ],
        range: range,
    })));
    return true;
};

export const underline: ToolbarItem = {
    icon: '<u>U</u>',
    label: 'Underline',
    command: underlineCommand,
};


const h1Command: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '# ' },
        ],
        range: range,
    })));
    return true;
};

export const h1: ToolbarItem = {
    icon: '<b>H1</b>',
    label: 'H1',
    command: h1Command,
};

const h2Command: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '## ' },
        ],
        range: range,
    })));
    return true;
};

export const h2: ToolbarItem = {
    icon: '<b>H2</b>',
    label: 'H2',
    command: h2Command,
};

const h3Command: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '### ' },
        ],
        range: range,
    })));
    return true;
};

export const h3: ToolbarItem = {
    icon: '<b>H3</b>',
    label: 'H3',
    command: h3Command,
};

const h4Command: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '#### ' },
        ],
        range: range,
    })));
    return true;
};

export const h4: ToolbarItem = {
    icon: '<b>H4</b>',
    label: 'H4',
    command: h4Command,
};

const h5Command: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '##### ' },
        ],
        range: range,
    })));
    return true;
};

export const h5: ToolbarItem = {
    icon: '<b>H5</b>',
    label: 'H5',
    command: h5Command,
};

const h6Command: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '###### ' },
        ],
        range: range,
    })));
    return true;
};

export const h6: ToolbarItem = {
    icon: '<b>H6</b>',
    label: 'H6',
    command: h6Command,
};

const quoteCommand: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '> ' },
        ],
        range: range,
    })));
    return true;
};

export const quote: ToolbarItem = {
    icon: '“'  ,
    label: 'Quote',
    command: quoteCommand,
};

const ulCommand: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '* ' },
        ],
        range: range,
    })));
    return true;
};

export const ul: ToolbarItem = {
    icon: '•',
    label: 'Unordered List',
    command: ulCommand,
};

const olCommand: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '1. ' },
        ],
        range: range,
    })));
    return true;
};

export const ol: ToolbarItem = {
    icon: '1.',
    label: 'Ordered List',
    command: olCommand,
};

const todoCommand: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '- [ ] ' },
        ],
        range: range,
    })));
    return true;
};

export const todo: ToolbarItem = {
    icon: '☐',
    label: 'Todo',
    command: todoCommand,
};

const linkCommand: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '[]()' },
        ],
        range: range,
    })));
    return true;
};

export const link: ToolbarItem = {
    icon: '🔗',
    label: 'Link',
    command: linkCommand,
};

const imageCommand: Command = (view) => {
    view.dispatch(view.state.changeByRange(range => ({
        changes: [
            { from: range.from, insert: '![]()' },
        ],
        range: range,
    })));
    return true;
};

export const image: ToolbarItem = {
    icon: '🖼️',
    label: 'Image',
    command: imageCommand,
};
