<script lang="ts">
  import { NodeViewWrapper, NodeViewContent } from 'svelte-tiptap'
  import { Plus, Trash2, Minus } from 'lucide-svelte'

  export let node: any
  export let editor: any
  export let getPos: any

  const addStep = () => {
    if (typeof getPos === 'function') {
      const pos = getPos()
      // Append to the end of the stepper
      const endPos = pos + node.nodeSize - 1
      editor
        .chain()
        .insertContentAt(endPos, {
          type: 'stepItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'New Step' }] }],
        })
        .run()
    }
  }

  const removeStep = () => {
    if (typeof getPos === 'function' && node.childCount > 0) {
      const pos = getPos()
      const lastChild = node.lastChild
      if (lastChild) {
        const from = pos + node.nodeSize - 1 - lastChild.nodeSize
        const to = pos + node.nodeSize - 1
        editor.chain().deleteRange({ from, to }).run()
      }
    }
  }

  const deleteStepper = () => {
    if (typeof getPos === 'function') {
      const pos = getPos()
      editor
        .chain()
        .deleteRange({ from: pos, to: pos + node.nodeSize })
        .run()
    }
  }
</script>

<NodeViewWrapper class="stepper-wrapper group relative my-8" data-block="stepper">
  <!-- Delete Tool (Top Right) -->
  <button
    contenteditable="false"
    class="absolute top-0 -right-10 hidden h-8 w-8 items-center justify-center rounded-lg text-gray-400 group-hover:flex hover:bg-red-50 hover:text-red-500"
    on:click={deleteStepper}
    title="Delete Stepper"
  >
    <Trash2 class="h-4 w-4" />
  </button>

  <div class="stepper-container relative ml-4 space-y-8 border-l-2 border-gray-200 pl-8">
    <NodeViewContent />
  </div>

  <!-- Add Step Button (Bottom) -->
  <div class="mt-4 ml-4 flex justify-center gap-2 pl-8" contenteditable="false">
    <button
      class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900"
      on:click={addStep}
    >
      <Plus class="h-4 w-4" />
      Add Step
    </button>
    <button
      class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900"
      on:click={removeStep}
      disabled={node.childCount === 0}
      title="Remove Last Step"
    >
      <Minus class="h-4 w-4" />
      Remove Step
    </button>
  </div>
</NodeViewWrapper>

<style>
  /* EDITOR-SIDE CSS for Stepper Visualization */
  /* We maintain parity with Reader logic using :global since Tiptap renders styles globally often */

  :global(.stepper-container) {
    counter-reset: step-counter; /* Initialize counter */
  }

  /* Target the step items rendered by NodeViewContent */
  :global([data-role='step-item']) {
    position: relative;
    counter-increment: step-counter; /* Increment per item */
  }

  /* The Number Circle */
  :global([data-role='step-item']::before) {
    content: counter(step-counter);
    position: absolute;
    left: -3.0625rem; /* Centered on the 2px border (Container pl-8 + border-l-2) */
    top: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: white;
    border: 2px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    color: #6b7280;
    z-index: 10;
  }

  /* Active/Latest State styling can be added if we track active step, 
     but for now it's a static list as requested */
</style>
