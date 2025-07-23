import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { describe, it, expect } from "vitest";
import { hideMarkersPlugin } from "./hideMarkers";

const createEditorView = (doc: string, cursorPosition: number) => {
  const state = EditorState.create({
    doc,
    extensions: [
      markdown({ base: markdownLanguage }),
      hideMarkersPlugin,
    ],
    selection: { anchor: cursorPosition },
  });
  const view = new EditorView({ state });
  document.body.appendChild(view.dom);
  view.dispatch({});
  return view;
};

const getDecorations = (view: EditorView): { from: number, to: number }[] => {
  const plugin = view.plugin(hideMarkersPlugin);
  if (!plugin) return [];
  const ranges: { from: number, to: number }[] = [];
  plugin.decorations.between(0, view.state.doc.length, (from, to) => {
    ranges.push({ from, to });
  });
  return ranges;
};

describe("hideMarkersPlugin", () => {
  describe("***strong emph***", () => {
    const text = "***strong emph***";

    it("should hide inner markers when cursor is outside", () => {
      const view = createEditorView(text, text.length);
      const decorations = getDecorations(view);
      expect(decorations).toEqual([
        { from: 1, to: 3 },
        { from: 14, to: 16 },
      ]);
    });

    it("should not hide markers when cursor is inside", () => {
      const view = createEditorView(text, 5);
      const decorations = getDecorations(view);
      expect(decorations.length).toBe(0);
    });
  });

  describe("***strong** in emph*", () => {
    const text = "***strong** in emph*";

    it("should hide inner markers when cursor is outside", () => {
      const view = createEditorView(text, text.length);
      const decorations = getDecorations(view);
      expect(decorations).toEqual([
        { from: 1, to: 3 },
        { from: 9, to: 11 },
      ]);
    });

    it("should not hide markers when cursor is in 'strong'", () => {
      const view = createEditorView(text, 5);
      const decorations = getDecorations(view);
      expect(decorations.length).toBe(0);
    });

    it("should hide only strong markers when cursor is in 'in emph'", () => {
      const view = createEditorView(text, 15);
      const decorations = getDecorations(view);
      expect(decorations).toEqual([
        { from: 1, to: 3 },
        { from: 9, to: 11 },
      ]);
    });
  });

  describe("***emph* in strong**", () => {
    const text = "***emph* in strong**";

    it("should hide inner markers when cursor is outside", () => {
      const view = createEditorView(text, text.length);
      const decorations = getDecorations(view);
      expect(decorations).toEqual([
        { from: 2, to: 3 },
        { from: 7, to: 8 },
      ]);
    });

    it("should not hide markers when cursor is in 'emph'", () => {
      const view = createEditorView(text, 5);
      const decorations = getDecorations(view);
      expect(decorations.length).toBe(0);
    });

    it("should hide only emph markers when cursor is in 'in strong'", () => {
      const view = createEditorView(text, 12);
      const decorations = getDecorations(view);
      expect(decorations).toEqual([
        { from: 2, to: 3 },
        { from: 7, to: 8 },
      ]);
    });
  });

  describe("**in strong *emph***", () => {
    const text = "**in strong *emph***";

    it("should hide inner markers when cursor is outside", () => {
      const view = createEditorView(text, text.length);
      const decorations = getDecorations(view);
      expect(decorations).toEqual([
        { from: 12, to: 13 },
        { from: 17, to: 18 },
      ]);
    });

    it("should not hide markers when cursor is in 'emph'", () => {
      const view = createEditorView(text, 15);
      const decorations = getDecorations(view);
      expect(decorations.length).toBe(0);
    });

    it("should hide only emph markers when cursor is in 'in strong'", () => {
      const view = createEditorView(text, 5);
      const decorations = getDecorations(view);
      expect(decorations).toEqual([
        { from: 12, to: 13 },
        { from: 17, to: 18 },
      ]);
    });
  });

  describe("*in emph **strong***", () => {
    const text = "*in emph **strong***";

    it("should hide inner markers when cursor is outside", () => {
      const view = createEditorView(text, text.length);
      const decorations = getDecorations(view);
      expect(decorations).toEqual([
        { from: 9, to: 11 },
        { from: 17, to: 19 },
      ]);
    });

    it("should not hide markers when cursor is in 'strong'", () => {
      const view = createEditorView(text, 15);
      const decorations = getDecorations(view);
      expect(decorations.length).toBe(0);
    });

    it("should hide only strong markers when cursor is in 'in emph'", () => {
      const view = createEditorView(text, 5);
      const decorations = getDecorations(view);
      expect(decorations).toEqual([
        { from: 9, to: 11 },
        { from: 17, to: 19 },
      ]);
    });
  });
});
