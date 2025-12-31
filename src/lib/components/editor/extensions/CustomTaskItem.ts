import TaskItem from '@tiptap/extension-task-item'

export const CustomTaskItem = TaskItem.extend({
    addNodeView() {
        return ({ node, HTMLAttributes, getPos, editor }) => {
            const listItem = document.createElement('li')
            listItem.setAttribute('data-type', 'taskItem')
            // Tailwind classes for the list item
            listItem.className = 'flex flex-row items-center gap-2 my-1 p-0'

            const label = document.createElement('label')
            label.contentEditable = 'false'
            label.className = 'flex items-center justify-center m-0 select-none cursor-pointer flex-shrink-0'

            const input = document.createElement('input')
            input.type = 'checkbox'
            input.tabIndex = -1
            // Use 'peer' pattern for custom styling
            input.className = 'peer sr-only' // Screen-reader only (hidden visually but accessible)
            input.checked = node.attrs.checked

            // Custom Checkbox Visual
            const checkboxDiv = document.createElement('div')
            checkboxDiv.className = `
        grid place-content-center
        w-[1.15rem] h-[1.15rem] 
        border-[1.5px] border-gray-300 rounded-[0.35rem] 
        transition-all duration-200 
        bg-transparent 
        hover:border-gray-400 hover:bg-gray-50
        peer-checked:bg-black peer-checked:border-black
        cursor-pointer
      `

            // SVG Checkmark
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            svg.setAttribute('viewBox', '0 0 24 24')
            svg.setAttribute('fill', 'none')
            svg.setAttribute('stroke', 'currentColor')
            svg.setAttribute('stroke-width', '4')
            svg.setAttribute('stroke-linecap', 'round')
            svg.setAttribute('stroke-linejoin', 'round')
            // Scale animation
            svg.classList.add('w-[0.65rem]', 'h-[0.65rem]', 'text-white', 'transform', 'scale-0', 'transition-transform', 'duration-100', 'ease-in-out')

            const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
            polyline.setAttribute('points', '20 6 9 17 4 12')
            svg.appendChild(polyline)
            checkboxDiv.appendChild(svg)

            // Add event listener to update Tiptap state
            input.addEventListener('change', (event) => {
                const target = event.target as HTMLInputElement
                const checked = target.checked

                if (typeof getPos === 'function') {
                    editor.commands.command(({ tr }) => {
                        const pos = getPos()
                        if (typeof pos !== 'number') return false

                        tr.setNodeMarkup(pos, undefined, {
                            ...node.attrs,
                            checked,
                        })
                        return true
                    })
                }
            })

            // Update the visual state when the input changes (via Tiptap or User) -> Handled by CSS peer-checked mostly, but let's be safe
            // Actually, purely CSS peer-checked on the sibling checkboxDiv will handle the visual toggle if input is checked.
            // But we need to update the SVG scale manually or via peer-checked logic?
            // Tailwind peer-checked:class works on subsequent siblings.
            // input (peer) -> checkboxDiv (peer-checked:...) -> svg (child of checkbox)
            // To style the CHILD of the sibling based on the peer, we need arbitrary groups or just specific CSS.
            // Tailwind v3 supports `peer-checked:[&>svg]:scale-100`.
            // Let's check if we can use that.

            checkboxDiv.className += ' peer-checked:[&>svg]:scale-100'

            label.append(input, checkboxDiv)

            const content = document.createElement('div')
            content.className = 'flex-1 min-w-0' // Ensure content takes remaining space

            // visual Checked state for content (strikethrough)
            if (node.attrs.checked) {
                content.classList.add('line-through', 'text-gray-400', 'opacity-80')
            }

            listItem.append(label, content)

            return {
                dom: listItem,
                contentDOM: content,
                ignoreMutation: (mutation) => {
                    // Ignore mutations on the label/input to prevent Tiptap from getting confused
                    return label.contains(mutation.target) || label === mutation.target
                },
                update: (updatedNode) => {
                    if (updatedNode.type !== this.type) return false

                    input.checked = updatedNode.attrs.checked

                    if (updatedNode.attrs.checked) {
                        content.classList.add('line-through', 'text-gray-400', 'opacity-80')
                    } else {
                        content.classList.remove('line-through', 'text-gray-400', 'opacity-80')
                    }

                    return true
                }
            }
        }
    }
})
