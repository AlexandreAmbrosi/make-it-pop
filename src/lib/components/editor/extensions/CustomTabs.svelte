<script lang="ts">
  import { NodeViewWrapper, NodeViewContent } from 'svelte-tiptap'
  import { onMount, onDestroy } from 'svelte'
  import { Plus, X } from 'lucide-svelte'

  export let node: any
  export let updateAttributes: any
  export let editor: any
  export let getPos: any

  let contentElement: HTMLElement
  let editingTitleIndex: number | null = null

  onMount(() => {
    // Inject global styles for tabs to ensure they work in Editor and Reader regardless of scoping
    // CSS-BASED LOGIC: We generate rules for 20 tabs to handle visibility purely via CSS.
    // This avoids JS fighting with Tiptap re-renders.
    const styleId = 'custom-tabs-styles'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      let rules = `
            .js-tab-panel {
                min-height: 100px;
                padding: 1.5rem;
                border: 1px solid #e5e7eb;
                border-top: none;
                border-bottom-left-radius: 0.5rem;
                border-bottom-right-radius: 0.5rem;
                background: white;
                /* Default hidden if pure CSS logic fails, but overridden below */
                display: none; 
            }
            
            /* FALLBACK: If no data-active-tab is present (e.g. sanitization), show the first panel */
            [data-block="tabs"]:not([data-active-tab]) .js-tab-panel:nth-of-type(1) {
                display: block !important;
                visibility: visible !important;
            }
        `
      // Generate rules for tabs 0-19
      for (let i = 0; i < 20; i++) {
        // If container has data-active-tab="i", show the (i+1)th panel
        // We use standard descendent selector. If panels are wrapped, this still finds them.
        // We use nth-of-type to select the correct sibling order.
        // Note: We target ALL .js-tab-panel inside.
        // But we specifically want the i-th one to be visible.

        // Rule: When active-tab is i, the (i+1)th .js-tab-panel is visible.
        // This assumes panels are in DOM order.

        rules += `
                /* Relaxed selector to handle intermediate ProseMirror wrappers */
                [data-active-tab="${i}"] .js-tab-panel:nth-of-type(${i + 1}) {
                    display: block !important;
                    visibility: visible !important;
                }
                
                /* Ensure others stay hidden */
                [data-active-tab="${i}"] .js-tab-panel:not(:nth-of-type(${i + 1})) {
                    display: none !important;
                }
            `
      }

      style.textContent = rules
      document.head.appendChild(style)
    }
  })

  // No more Observer or JS Loop needed.
  // We just rely on Svelte updating the data attribute.

  function startEditing(index: number) {
    editingTitleIndex = index
  }

  function stopEditing() {
    editingTitleIndex = null
  }

  function handleKeyDown(e: KeyboardEvent, index: number) {
    if (e.key === 'Enter') {
      stopEditing()
    }
  }

  // Derived state
  $: titles = node.attrs.titles || []
  $: activeTab = node.attrs.activeTab || 0

  $: if (contentElement) {
    // Force Svelte to react to updates if needed
  }

  function setActive(index: number) {
    updateAttributes({ activeTab: index })
  }

  function updateTitle(index: number, newTitle: string) {
    const newTitles = [...titles]
    newTitles[index] = newTitle
    updateAttributes({ titles: newTitles })
  }

  const addTab = () => {
    // 1. Add title
    const newTitles = [...titles, `Tab ${titles.length + 1}`]

    // 2. Insert Panel Node
    if (typeof getPos === 'function') {
      const pos = getPos()
      // We append to the END of the node.
      // node.nodeSize includes opening and closing tag.
      // Content ends at pos + node.nodeSize - 1.
      const endPos = pos + node.nodeSize - 1

      editor
        .chain()
        .insertContentAt(endPos, {
          type: 'tabPanel',
          content: [{ type: 'paragraph' }],
        })
        .run()
    }

    // Update attributes AFTER content insert to sync state
    updateAttributes({ titles: newTitles, activeTab: newTitles.length - 1 })
  }

  const removeTab = (index: number, e: MouseEvent) => {
    e.stopPropagation()
    if (titles.length <= 1) return // Keep at least one

    if (typeof getPos === 'function') {
      const pos = getPos()
      // Need to find the exact range of the Nth panel
      // We can use node.content to calculate offsets
      let currentOffset = 1 // Skip opening tag
      let targetFrom = -1
      let targetSize = 0

      node.content.forEach((child: any, offset: number, index_: number) => {
        if (index_ === index) {
          targetFrom = pos + currentOffset
          targetSize = child.nodeSize
        }
        currentOffset += child.nodeSize
      })

      if (targetFrom !== -1) {
        editor
          .chain()
          .deleteRange({ from: targetFrom, to: targetFrom + targetSize })
          .run()
      }
    }

    // 2. Update titles
    const newTitles = titles.filter((_: any, i: number) => i !== index)
    let newActive = activeTab
    if (activeTab >= index && activeTab > 0) {
      newActive = activeTab - 1
    }
    updateAttributes({ titles: newTitles, activeTab: newActive })
  }

  const deleteTabsComponent = () => {
    if (typeof getPos === 'function') {
      const pos = getPos()
      editor
        .chain()
        .deleteRange({ from: pos, to: pos + node.nodeSize })
        .run()
    }
  }
</script>

<NodeViewWrapper class="tabs-wrapper group relative my-6 rounded-xl border border-gray-100 bg-gray-50/50 p-2" data-block="tabs" data-active-tab={activeTab}>
  <!-- Delete Component Button -->
  <button
    contenteditable="false"
    class="absolute -top-2 -right-2 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-400 opacity-0 shadow-sm ring-1 ring-gray-200 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 hover:ring-red-200"
    on:click={deleteTabsComponent}
    title="Delete Tabs Block"
  >
    <X class="h-3 w-3" />
  </button>

  <!-- Segmented Control UI -->
  <div class="scrollbar-hide mb-2 flex items-center gap-1 overflow-x-auto rounded-lg bg-gray-100/50 p-1 pr-6" data-role="tablist">
    {#each titles as title, i}
      <div
        role="button"
        tabindex="0"
        class="group relative flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all focus:outline-none {i === activeTab
          ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
          : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'}"
        on:click={() => setActive(i)}
        on:dblclick={() => startEditing(i)}
        on:keydown={(e) => {
          if (e.key === 'Enter') setActive(i)
        }}
      >
        <!-- Editable Title Logic -->
        {#if editingTitleIndex === i}
          <input
            type="text"
            value={title}
            class="min-w-[40px] bg-transparent text-center outline-none selection:bg-blue-100"
            style="width: {title.length + 1}ch"
            autofocus
            on:input={(e) => updateTitle(i, e.currentTarget.value)}
            on:keydown={(e) => handleKeyDown(e, i)}
            on:blur={stopEditing}
            on:click|stopPropagation
          />
        {:else}
          <!-- Display Title -->
          <span class="block min-w-[40px] cursor-pointer text-center select-none" style="width: {title.length + 1}ch">
            {title}
          </span>
        {/if}

        <!-- Delete Button (hover) -->
        {#if titles.length > 1}
          <button
            class="-mr-1 ml-1 rounded-full p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 hover:text-red-500"
            on:click={(e) => removeTab(i, e)}
            title="Remove Tab"
          >
            <X class="h-3 w-3" />
          </button>
        {/if}
      </div>
    {/each}

    <!-- Add Button -->
    <button
      class="ml-1 flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-all hover:bg-white hover:text-gray-700 hover:shadow-sm"
      on:click={addTab}
      title="Add Tab"
    >
      <Plus class="h-4 w-4" />
    </button>
  </div>
  <div class="panels-container" bind:this={contentElement}>
    <NodeViewContent />
  </div>
</NodeViewWrapper>
