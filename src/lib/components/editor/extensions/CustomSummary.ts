import { Node, mergeAttributes } from '@tiptap/core'

export const CustomSummary = Node.create({
    name: 'summary',

    addOptions() {
        return {
            HTMLAttributes: {},
        }
    },

    group: 'block', // 'block' to verify, might be inline? Usually summary behaves like a block header.

    content: 'text*', // Text only for title

    parseHTML() {
        return [
            {
                tag: 'summary',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'summary',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: 'px-6 py-4 bg-gray-50 border-b border-gray-100 font-medium cursor-pointer hover:bg-gray-100 transition-colors list-none flex items-center gap-2 text-gray-700',
            }),
            0,
        ]
    },
})
