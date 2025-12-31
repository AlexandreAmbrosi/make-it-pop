import { Node, mergeAttributes } from '@tiptap/core'
import { SvelteNodeViewRenderer } from 'svelte-tiptap'
import CustomTabsComponent from './CustomTabs.svelte'

export const CustomTabs = Node.create({
    name: 'tabs',

    addOptions() {
        return {
            HTMLAttributes: {},
        }
    },

    content: 'tabPanel+',

    group: 'block',

    addAttributes() {
        return {
            titles: {
                default: ['Tab 1', 'Tab 2'],
                parseHTML: element => {
                    // Try to parse titles from buttons if existing?
                    const buttons = element.querySelectorAll('[data-role="tab"]')
                    if (buttons.length) {
                        return Array.from(buttons).map(b => b.textContent || '')
                    }
                    return ['Tab 1', 'Tab 2']
                },
            },
            activeTab: {
                default: 0,
                parseHTML: element => {
                    // Maybe check aria-selected?
                    const selected = element.querySelector('[aria-selected="true"]')
                    if (selected) {
                        const index = selected.getAttribute('data-tab')
                        return index ? parseInt(index) : 0
                    }
                    return 0
                },
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-block="tabs"]',
                contentElement: '[data-role="panels"]' // Tell PM where to look for content
            },
        ]
    },

    renderHTML({ node, HTMLAttributes }) {
        const titles = node.attrs.titles || []
        const activeTab = node.attrs.activeTab || 0

        const buttons = titles.map((title: string, index: number) => {
            const isActive = index === activeTab
            return [
                'button',
                {
                    'data-role': 'tab',
                    'data-tab': index,
                    'aria-selected': isActive.toString(),
                    class: `px-4 py-2 text-sm font-medium border-b-2 hover:text-blue-600 transition-colors focus:outline-none ${isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`
                },
                title
            ]
        })

        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                'data-block': 'tabs',
                'data-active-tab': activeTab,
                class: 'my-6',
            }),
            ['div', {
                'data-role': 'tablist',
                class: 'flex border-b border-gray-200 overflow-x-auto no-scrollbar'
            }, ...buttons],
            ['div', { 'data-role': 'panels', class: 'mt-2' }, 0], // Wrap content hole to avoid RangeError
        ]
    },

    addNodeView() {
        return SvelteNodeViewRenderer(CustomTabsComponent)
    }
})
