import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

export const CustomCodeBlock = CodeBlockLowlight.extend({
    addNodeView() {
        return ({ editor, node, getPos }) => {
            const dom = document.createElement('div')
            dom.classList.add('relative', 'group', 'code-block-wrapper')

            // Content Wrapper (pre/code)
            const pre = document.createElement('pre')
            const code = document.createElement('code')

            // Important: Inherit language class for identifying language
            if (node.attrs.language) {
                code.classList.add(`language-${node.attrs.language}`)
            }

            pre.append(code)

            // Delete Button
            const button = document.createElement('button')
            button.contentEditable = 'false'
            button.classList.add(
                'absolute', 'top-2', 'right-2',
                'p-1', 'rounded-md',
                'text-gray-400', 'hover:text-white', 'hover:bg-white/10',
                'opacity-0', 'group-hover:opacity-100', 'transition-all',
                'z-10', 'flex', 'items-center', 'justify-center'
            )
            button.title = "Delete code block"

            // X Icon SVG
            button.type = 'button' // Prevent form submission if any
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'

            // Use onmousedown because ProseMirror often intercepts click/focus events
            button.onmousedown = (e) => {
                e.preventDefault()
                e.stopPropagation()

                // Manual deletion to ensure reliability
                if (typeof getPos === 'function') {
                    const pos = getPos()
                    if (typeof pos === 'number') {
                        editor.chain().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
                    }
                }
            }

            dom.append(button)
            dom.append(pre)

            return {
                dom,
                contentDOM: code,
                ignoreMutation: (mutation) => {
                    // Ignore mutations on the button or its children
                    return button.contains(mutation.target) || button === mutation.target
                },
                stopEvent: (event) => {
                    // Crucial: Stop ALL events on the button from bubbling to ProseMirror
                    // This ensures mousedown/click actually reach our handler
                    const target = event.target as Node
                    if (button.contains(target)) {
                        return true
                    }
                    return false
                },
                update: (updatedNode) => {
                    if (updatedNode.type !== this.type) return false

                    // Update language class if it changed
                    if (updatedNode.attrs.language !== node.attrs.language) {
                        code.className = `language-${updatedNode.attrs.language}`
                    }
                    return true
                }
            }
        }
    }
})
