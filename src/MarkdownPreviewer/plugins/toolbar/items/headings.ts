import { type ToolbarItem } from '../types';
import { createHeading } from './helpers';

export const h1: ToolbarItem = {
    icon: '<b>H1</b>',
    label: 'H1',
    command: createHeading(1),
};

export const h2: ToolbarItem = {
    icon: '<b>H2</b>',
    label: 'H2',
    command: createHeading(2),
};

export const h3: ToolbarItem = {
    icon: '<b>H3</b>',
    label: 'H3',
    command: createHeading(3),
};

export const h4: ToolbarItem = {
    icon: '<b>H4</b>',
    label: 'H4',
    command: createHeading(4),
};

export const h5: ToolbarItem = {
    icon: '<b>H5</b>',
    label: 'H5',
    command: createHeading(5),
};

export const h6: ToolbarItem = {
    icon: '<b>H6</b>',
    label: 'H6',
    command: createHeading(6),
};