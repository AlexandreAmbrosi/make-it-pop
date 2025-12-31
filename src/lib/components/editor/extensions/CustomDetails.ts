import { Node, mergeAttributes } from '@tiptap/core'

export const CustomDetails = Node.create({
    name: 'details',

    addOptions() {
        return {
            HTMLAttributes: {},
        }
    },

    content: 'summary block+', // Must have summary, then content

    group: 'block',

    addAttributes() {
        return {
            open: {
                default: true, // Default OPEN so user can see it when inserting!
                parseHTML: element => element.hasAttribute('open'),
                renderHTML: attributes => {
                    if (attributes.open) {
                        return { open: '' }
                    }
                    return {}
                },
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'details',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'details',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: 'border border-gray-200 rounded-lg my-4 bg-white overflow-hidden shadow-sm',
            }),
            0,
        ]
    },

    addNodeView() {
        return ({ node, HTMLAttributes, getPos, editor }) => {
            const dom = document.createElement('details')
            let currentNode = node // Track current node state to avoid stale closure

            // Apply classes
            dom.className = 'border border-gray-200 rounded-lg my-4 bg-white overflow-hidden shadow-sm'

            // Apply attributes
            if (node.attrs.open) {
                dom.open = true
            }

            // Manual click handling to ensure toggle works
            dom.addEventListener('click', (e) => {
                // Only handle clicks on the summary to toggle
                const summary = dom.querySelector('summary')
                const target = e.target as HTMLElement

                if (summary && (target === summary || summary.contains(target))) {
                    e.preventDefault() // Prevent native toggle to avoid conflict, we drive via state

                    if (typeof getPos === 'function') {
                        const pos = getPos()
                        if (typeof pos !== 'number') return

                        // Use currentNode.attrs.open instead of stale node.attrs.open
                        const isOpen = !currentNode.attrs.open
                        editor.commands.command(({ tr }) => {
                            tr.setNodeMarkup(pos, undefined, {
                                ...currentNode.attrs,
                                open: isOpen
                            })
                            return true
                        })
                    }
                }
            })

            return {
                dom,
                contentDOM: dom,
                update: (updatedNode) => {
                    if (updatedNode.type !== node.type) return false

                    // Update our local reference
                    currentNode = updatedNode

                    if (dom.open !== updatedNode.attrs.open) {
                        dom.open = updatedNode.attrs.open
                    }

                    return true
                }
            }
        }
    }
})
