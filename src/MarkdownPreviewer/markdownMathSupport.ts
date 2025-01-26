import { DelimiterType, MarkdownExtension, NodeSpec } from "@lezer/markdown";
import { NestedParse, parseMixed } from '@lezer/common';
import { stexMath } from "@codemirror/legacy-modes/mode/stex";
import { StreamLanguage } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const TEX_LANGUAGE = StreamLanguage.define(stexMath);

const INLINE_MATH_DOLLAR  =  'InlineMathDollar';
const INLINE_MATH_BRACKET = 'InlineMathBracket';
const BLOCK_MATH_DOLLAR   =   'BlockMathDollar';
const BLOCK_MATH_BRACKET  =  'BlockMathBracket';

const DELIMITER_LENGTH: Record<string, number> = {
    [INLINE_MATH_DOLLAR] :  1,
    [INLINE_MATH_BRACKET]:  3,
    [BLOCK_MATH_DOLLAR]  :  2,
    [BLOCK_MATH_BRACKET] :  3,
};

const DELIMITERS = Object.keys(DELIMITER_LENGTH).reduce<Record<string, DelimiterType>>((agg, name) => {
    agg[name] = { mark: `${name}Mark`, resolve: name };
    return agg
}, {});

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

const LatexLanguageExtension: MarkdownExtension = {
    defineNodes: defineNodes,
    parseInline: [
        {
            name: INLINE_MATH_DOLLAR,
            parse(cx, next, pos) {
                if (next !== 36 || cx.char(pos + 1) === 36){
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
    wrap: parseMixed((node, _input) => {
        const delimiterLength = DELIMITER_LENGTH[node.type.name]
        if (delimiterLength) {
            return {
                parser: TEX_LANGUAGE.parser,
                overlay: [
                    {
                        from: node.from + delimiterLength,
                        to: node.to - delimiterLength
                    }
                ],
            } as NestedParse;
        }
        return null;
    }),
};

export const markdownMathSupport = [
    LatexLanguageExtension,
];