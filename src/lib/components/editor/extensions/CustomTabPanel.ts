import { Node, mergeAttributes } from '@tiptap/core'

export const CustomTabPanel = Node.create({
    name: 'tabPanel',

    addOptions() {
        return {
            HTMLAttributes: {},
        }
    },

    content: 'block+',

    group: 'block',

    parseHTML() {
        return [
            {
                tag: 'div[data-role="panel"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                'data-role': 'panel',
                class: 'p-6 border border-t-0 border-gray-200 rounded-b-lg bg-white js-tab-panel',
            }),
            0,
        ]
    },
})
