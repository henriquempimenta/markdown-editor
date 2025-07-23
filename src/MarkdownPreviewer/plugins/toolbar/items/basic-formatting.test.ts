import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { describe, it, expect } from "vitest";
import { boldCommand, strikeCommand, italicCommand, underlineCommand } from "./basic-formatting";

describe("boldCommand", () => {
  const createEditorState = (
    doc: string,
    selectionStart?: number,
    selectionEnd?: number
  ) => {
    return EditorState.create({
      doc,
      extensions: [markdown({ base: markdownLanguage })],
      selection:
        selectionStart !== undefined && selectionEnd !== undefined
          ? { anchor: selectionStart, head: selectionEnd }
          : undefined,
    });
  };
  it("should wrap selected text with ** for bolding", () => {
    const initialState = createEditorState("hello world", 6, 11);
    const view = new EditorView({ state: initialState });
    boldCommand(view);
    expect(view.state.doc.toString()).toBe("hello **world**");
  });
  it("should insert ** at cursor position if no text is selected", () => {
    const initialState = createEditorState("hello world", 6, 6);
    const view = new EditorView({ state: initialState });
    boldCommand(view);
    expect(view.state.doc.toString()).toBe("hello ****world");
  });
  it("should handle multiple lines", () => {
    const initialState = createEditorState("line one\nline two");
    const view = new EditorView({ state: initialState });
    view.dispatch({ selection: { anchor: 0, head: 17 } });
    boldCommand(view);
    expect(view.state.doc.toString()).toBe("**line one\nline two**");
  });
});

describe("strikeCommand", () => {
  const createEditorState = (
    doc: string,
    selectionStart?: number,
    selectionEnd?: number
  ) => {
    return EditorState.create({
      doc,
      extensions: [markdown({ base: markdownLanguage })],
      selection:
        selectionStart !== undefined && selectionEnd !== undefined
          ? { anchor: selectionStart, head: selectionEnd }
          : undefined,
    });
  };
  it("should wrap selected text with ~~ for strikethrough", () => {
    const initialState = createEditorState("hello world", 6, 11);
    const view = new EditorView({ state: initialState });
    strikeCommand(view);
    expect(view.state.doc.toString()).toBe("hello ~~world~~");
  });
  it("should wrap selected character with ~~ for strikethrough", () => {
    const initialState = createEditorState("hello world", 1, 2);
    const view = new EditorView({ state: initialState });
    strikeCommand(view);
    expect(view.state.doc.toString()).toBe("h~~e~~llo world");
  });
  it("should insert ~~ at cursor position if no text is selected", () => {
    const initialState = createEditorState("hello world", 6, 6);
    const view = new EditorView({ state: initialState });
    strikeCommand(view);
    expect(view.state.doc.toString()).toBe("hello ~~~~world");
  });
  it("should handle multiple lines", () => {
    const initialState = createEditorState("line one\nline two");
    const view = new EditorView({ state: initialState });
    view.dispatch({ selection: { anchor: 0, head: 17} });
    strikeCommand(view);
    expect(view.state.doc.toString()).toBe("~~line one\nline two~~");
  });
});

describe("italicCommand", () => {
  const createEditorState = (
    doc: string,
    selectionStart?: number,
    selectionEnd?: number
  ) => {
    return EditorState.create({
      doc,
      extensions: [markdown({ base: markdownLanguage })],
      selection:
        selectionStart !== undefined && selectionEnd !== undefined
          ? { anchor: selectionStart, head: selectionEnd }
          : undefined,
    });
  };
  it("should wrap selected text with * for italic", () => {
    const initialState = createEditorState("hello world", 6, 11);
    const view = new EditorView({ state: initialState });
    italicCommand(view);
    expect(view.state.doc.toString()).toBe("hello *world*");
  });
  it("should insert * at cursor position if no text is selected", () => {
    const initialState = createEditorState("hello world", 6, 6);
    const view = new EditorView({ state: initialState });
    italicCommand(view);
    expect(view.state.doc.toString()).toBe("hello **world");
  });
  it("should handle multiple lines", () => {
    const initialState = createEditorState("line one\nline two");
    const view = new EditorView({ state: initialState });
    view.dispatch({ selection: { anchor: 0, head: 17 } });
    italicCommand(view);
    expect(view.state.doc.toString()).toBe("*line one\nline two*");
  });
});

describe("underlineCommand", () => {
  const createEditorState = (
    doc: string,
    selectionStart?: number,
    selectionEnd?: number
  ) => {
    return EditorState.create({
      doc,
      extensions: [markdown({ base: markdownLanguage })],
      selection:
        selectionStart !== undefined && selectionEnd !== undefined
          ? { anchor: selectionStart, head: selectionEnd }
          : undefined,
    });
  };
  it("should wrap selected text with <u> for underline", () => {
    const initialState = createEditorState("hello world", 6, 11);
    const view = new EditorView({ state: initialState });
    underlineCommand(view);
    expect(view.state.doc.toString()).toBe("hello <u>world</u>");
  });
  it("should insert <u></u> at cursor position if no text is selected", () => {
    const initialState = createEditorState("hello world", 6, 6);
    const view = new EditorView({ state: initialState });
    underlineCommand(view);
    expect(view.state.doc.toString()).toBe("hello <u></u>world");
  });
  it("should handle multiple lines", () => {
    const initialState = createEditorState("line one\nline two");
    const view = new EditorView({ state: initialState });
    view.dispatch({ selection: { anchor: 0, head: 17 } });
    underlineCommand(view);
    expect(view.state.doc.toString()).toBe("<u>line one\nline two</u>");
  });
});