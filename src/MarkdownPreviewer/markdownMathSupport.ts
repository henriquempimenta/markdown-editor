/**
 * @overview A Markdown extension supporting LaTeX-style mathematical expressions within documents. This module enables the parsing and rendering of inline and block-level mathematical content using delimiters such as `$...$` and `$$...$$` (dollar signs), as well as `\\(...\\)` and `\\[...\\]` (brackets). It integrates with a TeX language parser to handle the actual mathematical expressions.
 * @module markdownMathSupport
 */

import { DelimiterType, MarkdownExtension, NodeSpec } from "@lezer/markdown";
import { NestedParse, parseMixed } from '@lezer/common';
import { stexMath } from "@codemirror/legacy-modes/mode/stex";
import { StreamLanguage } from "@codemirror/language";
import { tags } from "@lezer/highlight";

/**
 * @namespace Constants and configurations for math delimiters.
 */
const TEX_LANGUAGE = StreamLanguage.define(stexMath);

/**
 * @constant {string} - Names of inline and block-level math delimiters.
 */
const INLINE_MATH_DOLLAR  =  'InlineMathDollar';
const INLINE_MATH_BRACKET = 'InlineMathBracket';
const BLOCK_MATH_DOLLAR   =   'BlockMathDollar';
const BLOCK_MATH_BRACKET  =  'BlockMathBracket';

/**
 * @constant {Object<string, number>} - Lengths of each delimiter type.
 */
export const DELIMITER_LENGTH: Record<string, number> = {
    [INLINE_MATH_DOLLAR] :  1,
    [INLINE_MATH_BRACKET]:  3,
    [BLOCK_MATH_DOLLAR]  :  2,
    [BLOCK_MATH_BRACKET] :  3,
};

/**
 * @constant {Object<string, DelimiterType>} - Mapping of delimiter names to their types.
 */
const DELIMITERS = Object.keys(DELIMITER_LENGTH).reduce<Record<string, DelimiterType>>((agg, name) => {
    agg[name] = { mark: `${name}Mark`, resolve: name };
    return agg
}, {});

/**
 * @constant {(string | NodeSpec)[]} - Definitions for nodes and their marks.
 */
const defineNodes: (string | NodeSpec)[] = [];
Object.keys(DELIMITER_LENGTH).forEach(name => {
    defineNodes.push(
        {
            name: name,
            style: tags.emphasis,
        },
        {
            name: `${name}Mark`,
            style: tags.processingInstruction,
        }
    )
});
/**
 * @classdesc The main extension class that integrates math support into Markdown.
 */
const LatexLanguageExtension: MarkdownExtension = {
    defineNodes: defineNodes,
    parseInline: [
        /**
         * Parser for inline math using `$` delimiters.
         */
        {
            name: INLINE_MATH_DOLLAR,
            parse(cx, next, pos) {
                if (next !== 36 || cx.char(pos + 1) === 36 || cx.char(pos - 1) === 36){
                    return -1;
                }

                return cx.addDelimiter(
                    DELIMITERS[INLINE_MATH_DOLLAR],
                    pos,
                    pos + DELIMITER_LENGTH[INLINE_MATH_DOLLAR],
                    true,
                    true
                );
            }
        },
        /**
         * Parser for inline math using `\\( ... \\)` delimiters.
         */
        {
            name: INLINE_MATH_BRACKET,
            before: "Escape",
            parse(cx, next, pos) {
                if (next !== 92 || cx.char(pos + 1) !== 92 || ![40, 41].includes(cx.char(pos + 2))) {
                    return -1;
                }
                return cx.addDelimiter(
                    DELIMITERS[INLINE_MATH_BRACKET],
                    pos,
                    pos + DELIMITER_LENGTH[INLINE_MATH_BRACKET],
                    cx.char(pos + 2) === 40,
                    cx.char(pos + 2) === 41
                );
            },
        },
        /**
         * Parser for block-level math using `$$` delimiters.
         */
        {
            name: BLOCK_MATH_DOLLAR,
            parse(cx, next, pos) {
                if (next !== 36 || cx.char(pos + 1) !== 36) {
                    return -1;
                }
                return cx.addDelimiter(
                    DELIMITERS[BLOCK_MATH_DOLLAR],
                    pos,
                    pos + DELIMITER_LENGTH[BLOCK_MATH_DOLLAR],
                    true,
                    true
                )
            },
        },
        /**
         * Parser for block-level math using `\\[...\\]` delimiters.
         */
        {
            name: BLOCK_MATH_BRACKET,
            before: "Escape",
            parse(cx, next, pos) {
                if (next !== 92 || cx.char(pos + 1) !== 92 || ![91, 93].includes(cx.char(pos + 2))) {
                    return -1;
                }
                return cx.addDelimiter(
                    DELIMITERS[BLOCK_MATH_BRACKET],
                    pos,
                    pos + DELIMITER_LENGTH[BLOCK_MATH_BRACKET],
                    cx.char(pos + 2) === 91,
                    cx.char(pos + 2) === 93
                );
            },
        }
    ],
    /**
     * @memberOf LatexLanguageExtension
     * @desc Applies the TeX language parser to the content between delimiters.
     */
    wrap: parseMixed((node, _input) => {
        const delimiterLength = DELIMITER_LENGTH[node.type.name]
        if (delimiterLength) {
            const from = node.from + delimiterLength;
            const   to = node.to   - delimiterLength;

            if (from === to) {
                return null;
            }

            return {
                parser: TEX_LANGUAGE.parser,
                overlay: [
                    {
                        from: from,
                        to: to
                    }
                ],
            } as NestedParse;
        }
        return null;
    }),
};

/**
 * @constant {MarkdownExtension[]} - Exports the extension for integration into Markdown processors.
 */
export const markdownMathSupport = [
    LatexLanguageExtension,
];