import { Node, mergeAttributes } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'svelte-tiptap'
import CustomStepperSvelte from './CustomStepper.svelte'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        stepper: {
            setStepper: () => ReturnType
            addStep: () => ReturnType
        }
    }
}

export const CustomStepper = Node.create({
    name: 'stepper',

    group: 'block',

    content: 'stepItem+',

    draggable: true,

    addAttributes() {
        return {
            'data-block': {
                default: 'stepper',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-block="stepper"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-block': 'stepper' }), 0]
    },

    addCommands() {
        return {
            setStepper:
                () =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: 'stepper',
                            content: [
                                {
                                    type: 'stepItem',
                                    content: [
                                        {
                                            type: 'paragraph',
                                            content: [{ type: 'text', text: 'Step 1' }],
                                        },
                                    ],
                                },
                                {
                                    type: 'stepItem',
                                    content: [
                                        {
                                            type: 'paragraph',
                                            content: [{ type: 'text', text: 'Step 2' }],
                                        },
                                    ],
                                },
                            ],
                        })
                    },
            addStep:
                () =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: 'stepItem',
                            content: [
                                {
                                    type: 'paragraph',
                                    content: [{ type: 'text', text: 'New Step' }],
                                },
                            ],
                        })
                    },
        }
    },

    addNodeView() {
        return SvelteNodeViewRenderer(CustomStepperSvelte)
    },
})

export const StepItem = Node.create({
    name: 'stepItem',

    group: 'block',

    content: 'block+',

    draggable: true,

    addAttributes() {
        return {
            'data-role': {
                default: 'step-item',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-role="step-item"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, { 'data-role': 'step-item' }),
            ['div', { 'data-role': 'step-content' }, 0],
        ]
    },
})
