import { EditorView } from "@codemirror/view";
import { Extension } from "@uiw/react-codemirror";
import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";

export const lightTheme = createTheme({
    theme: 'light',
    settings: {
      background: '#ffffff',
      foreground: '#24292e',
      caret: '#526fff',
      selection: '#0366d626',
      lineHighlight: '#f6f8fa',
      gutterBackground: '#ffffff',
      gutterForeground: '#6a737d',
    },
    styles: [
      { tag: t.heading, color: '#0366d6' },
      { tag: t.strong, fontWeight: 'bold' },
      { tag: t.emphasis, fontStyle: 'italic' },
      { tag: t.link, color: '#0366d6' },
      { tag: t.quote, color: '#22863a' },
      { tag: t.monospace, color: '#e36209' },
      { tag: t.list, color: '#24292e' },
      { tag: t.keyword, color: '#d73a49' },
      { tag: t.atom, color: '#005cc5' },
      { tag: t.number, color: '#005cc5' },
      { tag: t.string, color: '#032f62' },
      { tag: t.comment, color: '#6a737d', fontStyle: 'italic' },
      { tag: t.meta, color: '#0366d6' },
      { tag: t.regexp, color: '#032f62' },
      { tag: t.tagName, color: '#22863a' },
      { tag: t.attributeName, color: '#6f42c1' },
      { tag: t.attributeValue, color: '#032f62' },
      { tag: t.className, color: '#6f42c1' },
      { tag: t.propertyName, color: '#005cc5' },
    ],
});

export const darkTheme: Extension = createTheme({
    theme: 'dark',
    settings: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      caret: '#d4d4d4',
      selection: '#3a3d41',
      lineHighlight: '#ffffff0f',
      gutterBackground: '#1e1e1e',
      gutterForeground: '#858585',
    },
    styles: [
      { tag: t.heading, color: '#9cdcfe' },
      { tag: t.strong, fontWeight: 'bold' },
      { tag: t.emphasis, fontStyle: 'italic' },
      { tag: t.link, color: '#ce9178' },
      { tag: t.quote, color: '#6a9955' },
      { tag: t.monospace, color: '#ce9178' },
      { tag: t.list, color: '#d4d4d4' },
      { tag: t.keyword, color: '#c586c0' },
      { tag: t.atom, color: '#9cdcfe' },
      { tag: t.number, color: '#b5cea8' },
      { tag: t.string, color: '#ce9178' },
      { tag: t.comment, color: '#6a9955', fontStyle: 'italic' },
      { tag: t.meta, color: '#9cdcfe' },
      { tag: t.regexp, color: '#d16969' },
      { tag: t.tagName, color: '#569cd6' },
      { tag: t.attributeName, color: '#9cdcfe' },
      { tag: t.attributeValue, color: '#ce9178' },
      { tag: t.className, color: '#4ec9b0' },
      { tag: t.propertyName, color: '#d4d4d4' },
    ],
});

export const EDITOR_VIEW_THEME: Extension = EditorView.theme({
    '.cm-scroller': {
      overflow: 'hidden',
      fontFamily: '"Roboto", sans-serif',
    },
    '.cm-lineNumbers': {
      display: 'none',
    },
    '.cm-gutters': {
      display: 'none',
    },
    '.cm-activeLine': {
      backgroundColor: 'unset',
    },
  });