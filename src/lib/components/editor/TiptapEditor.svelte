<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import Image from '@tiptap/extension-image'
  import Link from '@tiptap/extension-link'
  import Youtube from '@tiptap/extension-youtube'
  import Placeholder from '@tiptap/extension-placeholder'
  import Typography from '@tiptap/extension-typography'
  import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
  import TextAlign from '@tiptap/extension-text-align'
  import TaskList from '@tiptap/extension-task-list'
  import TaskItem from '@tiptap/extension-task-item'
  import { Table } from '@tiptap/extension-table'
  import { TableRow } from '@tiptap/extension-table-row'
  import { TableCell } from '@tiptap/extension-table-cell'
  import { TableHeader } from '@tiptap/extension-table-header'
  // Color extensions
  import { TextStyle } from '@tiptap/extension-text-style'
  import { Color } from '@tiptap/extension-color'
  import Underline from '@tiptap/extension-underline'
  import FontFamily from '@tiptap/extension-font-family'

  // Icons
  import {
    Bold,
    Italic,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    CheckSquare,
    Quote,
    Code,
    Eraser,
    Table as TableIcon,
    Image as ImageIcon,
    Link as LinkIcon,
    Info,
    AlertTriangle,
    Lightbulb,
    Type,
    Underline as UnderlineIcon,
    FileCode,
    Trash2,
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    PanelLeftOpen,
    PanelRightOpen,
    PanelTopOpen,
    PanelBottomOpen,
    MonitorPlay,
  } from 'lucide-svelte'

  import { common, createLowlight } from 'lowlight'
  import { COURSE_PROSE_CLASS } from '$lib/constants/styles'

  // Callout Extension
  import { Node, mergeAttributes } from '@tiptap/core'

  const lowlight = createLowlight(common)

  const Callout = Node.create({
    name: 'callout',
    group: 'block',
    content: 'block+',
    defining: true,
    addAttributes() {
      return {
        type: {
          default: 'info',
        },
      }
    },
    parseHTML() {
      return [{ tag: 'div[data-type="callout"]' }]
    },
    renderHTML({ HTMLAttributes }) {
      return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'callout', class: `callout callout-${HTMLAttributes.type}` }), 0]
    },
  })

  // Generic Embed Extension
  const GenericEmbed = Node.create({
    name: 'iframe',
    group: 'block',
    atom: true,
    addOptions() {
      return {
        allowlist: ['youtube.com', 'youtu.be', 'player.vimeo.com', 'figma.com', 'loom.com'],
      }
    },
    addAttributes() {
      return {
        src: {
          default: null,
        },
        frameborder: {
          default: 0,
        },
        allowfullscreen: {
          default: true,
        },
      }
    },
    parseHTML() {
      return [
        {
          tag: 'iframe',
        },
      ]
    },
    renderHTML({ HTMLAttributes }) {
      return ['div', { class: 'iframe-wrapper' }, ['iframe', mergeAttributes(HTMLAttributes, { class: 'w-full aspect-video border-none rounded-lg bg-gray-100' })]]
    },
    addCommands() {
      return {
        setIframe:
          (options: { src: string }) =>
          ({ commands }: { commands: any }) => {
            let url = options.src
            // Validate allowlist
            const isValid = this.options.allowlist.some((domain: string) => url.includes(domain))

            if (!isValid) {
              alert('Domain not allowed for embed. Please use a link instead.')
              return commands.setLink({ href: url })
            }

            // Figma adjustment
            if (url.includes('figma.com')) {
              if (!url.includes('figma.com/embed')) {
                url = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`
              }
            }

            return commands.insertContent({
              type: this.name,
              attrs: { src: url },
            })
          },
      }
    },
  })

  export let content = ''
  export let title = ''
  export let placeholder = 'Start writing...'
  export let editable = true
  export let headings: { level: number; text: string; pos: number }[] = []

  let element: HTMLElement
  let editor: Editor

  function updateHeadings() {
    if (!editor) return
    const newHeadings: typeof headings = []
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        newHeadings.push({
          level: node.attrs.level,
          text: node.textContent,
          pos: pos,
        })
      }
    })
    headings = newHeadings
  }

  export function scrollToPos(pos: number) {
    if (editor) {
      editor.chain().focus().setTextSelection(pos).scrollIntoView().run()
      // For good measure, sometimes scrollIntoView needs help if inside a customized scroll container
      // But let's try standard Tiptap first.
    }
  }

  // Image Upload Logic
  let fileInput: HTMLInputElement

  const addImage = () => {
    fileInput?.click()
  }

  const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      handleImageUpload(target.files[0])
    }
    // Reset value so same file can be selected again
    target.value = ''
  }

  // Embed Logic
  const addEmbed = () => {
    const url = window.prompt('Embed URL (YouTube, Vimeo, Figma, Loom)')
    if (!url) return

    if (url.includes('youtube') || url.includes('youtu.be')) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run()
    } else {
      editor.chain().focus().setIframe({ src: url }).run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const handleImageUpload = async (file: File) => {
    try {
      const res = await fetch('/api/storage/presigned-url', {
        method: 'POST',
        body: JSON.stringify({ name: file.name, type: file.type }),
        headers: { 'Content-Type': 'application/json' },
      })
      const { signedUrl, fileKey, publicUrl } = await res.json()

      if (signedUrl) {
        await fetch(signedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        })
        // Use the publicUrl returned from server, or fallback to signedUrl base if missing
        const finalUrl = publicUrl || signedUrl.split('?')[0]
        editor.chain().focus().setImage({ src: finalUrl }).run()
      }
    } catch (e) {
      console.error('Upload failed', e)
      alert('Upload failed')
    }
  }

  const onDrop = (event: DragEvent) => {
    const hasFiles = event.dataTransfer?.files?.length
    if (hasFiles) {
      event.preventDefault()
      const images = Array.from(event.dataTransfer.files).filter((file) => /image/i.test(file.type))
      if (images.length === 0) return

      handleImageUpload(images[0])
      return true
    }
    return false
  }

  // Table Menu State
  let showTableMenu = false
  let tableMenuPos = { top: 0, right: 0 }

  function updateTableMenu() {
    if (!editor) return

    if (!editor.isActive('table')) {
      showTableMenu = false
      return
    }

    const { selection } = editor.state
    const { view } = editor

    // Find the current table node in DOM
    // We look for the closest table ancestor of the selection
    const domAtPos = view.domAtPos(selection.from)
    const node = domAtPos.node instanceof HTMLElement ? domAtPos.node : domAtPos.node.parentElement
    const tableElement = node?.closest('table')

    if (tableElement) {
      const rect = tableElement.getBoundingClientRect()
      // Calculate relative to viewport since we'll use fixed positioning
      // Position at Top Right of the table, slightly outside
      // We align the right edge of the menu with the right edge of the table.
      // right property corresponds to distance from RIGHT of viewport.
      tableMenuPos = {
        top: rect.top - 40, // Height of menu approx
        right: window.innerWidth - rect.right, // Distance from viewport right edge
      }
      showTableMenu = true
    } else {
      showTableMenu = false
    }
  }

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit.configure({
          codeBlock: false,
        }),
        CodeBlockLowlight.configure({
          lowlight,
        }),
        Image,
        Link.configure({
          openOnClick: false,
        }),
        Youtube.configure({
          controls: true,
          nocookie: true,
        }),
        Placeholder.configure({
          placeholder,
        }),
        Typography,
        TextAlign.configure({
          types: ['heading', 'paragraph', 'image'],
        }),
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader.extend({
          addAttributes() {
            return {
              ...this.parent?.(),
              backgroundColor: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-background-color'),
                renderHTML: (attributes) => {
                  if (!attributes.backgroundColor) {
                    return {}
                  }
                  return {
                    'data-background-color': attributes.backgroundColor,
                    style: `background-color: ${attributes.backgroundColor}`,
                  }
                },
              },
            }
          },
        }),
        TableCell.extend({
          addAttributes() {
            return {
              ...this.parent?.(),
              backgroundColor: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-background-color'),
                renderHTML: (attributes) => {
                  if (!attributes.backgroundColor) {
                    return {}
                  }
                  return {
                    'data-background-color': attributes.backgroundColor,
                    style: `background-color: ${attributes.backgroundColor}`,
                  }
                },
              },
            }
          },
        }),
        Callout,
        GenericEmbed,
        TextStyle,
        Color,
        Underline,
        FontFamily,
        // Removed BubbleMenu extension to handle manual positioning
      ],
      content,
      editable,
      onUpdate: ({ editor }) => {
        content = editor.getHTML()
        updateHeadings()
        updateTableMenu()
      },
      onTransaction: () => {
        // Force re-render so `editor.isActive` works
        editor = editor
        updateHeadings()
        updateTableMenu()
      },
      onSelectionUpdate: () => {
        updateTableMenu()
      },
      editorProps: {
        attributes: {
          class: `${COURSE_PROSE_CLASS} mx-auto focus:outline-none min-h-[300px] py-4 max-w-full`,
        },
        handleDrop: (view, event, slice, moved) => {
          if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            onDrop(event)
            return true
          }
          return false
        },
      },
    })
  })

  onDestroy(() => {
    if (editor) {
      editor.destroy()
    }
  })

  // Also need to handle window scroll/resize to update position if menu is fixed
  function onScrollOrResize() {
    if (showTableMenu) {
      updateTableMenu()
    }
  }

  const setCallout = (type: 'info' | 'warning' | 'tip') => {
    editor.chain().focus().toggleWrap('callout', { type }).run()
  }
</script>

<svelte:window on:scroll={onScrollOrResize} on:resize={onScrollOrResize} />

<div class="relative flex min-h-full flex-col bg-white">
  {#if editor && editable}
    <!-- Horizontal Sticky Toolbar -->
    <div class="sticky top-0 z-20 flex w-full flex-wrap items-center gap-1 border-b bg-gray-50 p-2 shadow-sm">
      <!-- Basic Formatting -->
      <div class="flex items-center gap-1 border-r pr-2">
        <button class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive('bold') ? 'bg-gray-200' : ''}" on:click={() => editor.chain().focus().toggleBold().run()} title="Bold"
          ><Bold class="h-4 w-4" /></button
        >
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive('italic') ? 'bg-gray-200' : ''}"
          on:click={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"><Italic class="h-4 w-4" /></button
        >
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive('underline') ? 'bg-gray-200' : ''}"
          on:click={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"><UnderlineIcon class="h-4 w-4" /></button
        >
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive('strike') ? 'bg-gray-200' : ''}"
          on:click={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"><Strikethrough class="h-4 w-4" /></button
        >
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive('textStyle', { fontFamily: 'monospace' }) ? 'bg-gray-200' : ''}"
          on:click={() =>
            editor.isActive('textStyle', { fontFamily: 'monospace' }) ? editor.chain().focus().unsetFontFamily().run() : editor.chain().focus().setFontFamily('monospace').run()}
          title="Monospace"><FileCode class="h-4 w-4" /></button
        >
      </div>

      <!-- Color Picker -->
      <div class="flex items-center gap-1 border-r px-2">
        <div class="relative flex items-center justify-center rounded p-1 hover:bg-gray-200">
          <Type class="h-4 w-4 text-gray-700" />
          <input
            type="color"
            class="absolute inset-0 cursor-pointer opacity-0"
            on:input={(event) => editor.chain().focus().setColor(event.currentTarget.value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
            title="Text Color"
          />
        </div>
      </div>

      <!-- Alignment -->
      <div class="flex items-center gap-1 border-r px-2">
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}"
          on:click={() => editor.chain().focus().setTextAlign('left').run()}
          title="Align Left"><AlignLeft class="h-4 w-4" /></button
        >
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}"
          on:click={() => editor.chain().focus().setTextAlign('center').run()}
          title="Align Center"><AlignCenter class="h-4 w-4" /></button
        >
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}"
          on:click={() => editor.chain().focus().setTextAlign('right').run()}
          title="Align Right"><AlignRight class="h-4 w-4" /></button
        >
      </div>

      <!-- Headings -->
      <div class="flex items-center gap-1 border-r px-2">
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}"
          on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"><Heading1 class="h-4 w-4" /></button
        >
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}"
          on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"><Heading2 class="h-4 w-4" /></button
        >
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}"
          on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"><Heading3 class="h-4 w-4" /></button
        >
      </div>

      <!-- Lists -->
      <div class="flex items-center gap-1 border-r px-2">
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive('bulletList') ? 'bg-gray-200' : ''}"
          on:click={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"><List class="h-4 w-4" /></button
        >
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive('orderedList') ? 'bg-gray-200' : ''}"
          on:click={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered List"><ListOrdered class="h-4 w-4" /></button
        >
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive('taskList') ? 'bg-gray-200' : ''}"
          on:click={() => editor.chain().focus().toggleTaskList().run()}
          title="Task List"><CheckSquare class="h-4 w-4" /></button
        >
      </div>

      <!-- Blocks -->
      <div class="flex items-center gap-1 border-r px-2">
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive('blockquote') ? 'bg-gray-200' : ''}"
          on:click={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"><Quote class="h-4 w-4" /></button
        >
        <button
          class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive('codeBlock') ? 'bg-gray-200' : ''}"
          on:click={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"><Code class="h-4 w-4" /></button
        >
      </div>

      <!-- Insert -->
      <div class="flex items-center gap-1 border-r px-2">
        <button
          class="rounded p-1 text-sm hover:bg-gray-200"
          on:click={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Insert Table"><TableIcon class="h-4 w-4" /></button
        >
        <button class="rounded p-1 text-sm hover:bg-gray-200" on:click={addImage} title="Add Image">
          <ImageIcon class="h-4 w-4" />
        </button>
        <button class="rounded p-1 text-sm hover:bg-gray-200 {editor.isActive('link') ? 'bg-gray-200' : ''}" on:click={setLink} title="Link"><LinkIcon class="h-4 w-4" /></button>
        <button class="rounded p-1 text-sm hover:bg-gray-200" on:click={addEmbed} title="Embed Video/Design">
          <MonitorPlay class="h-4 w-4" />
        </button>
      </div>

      <!-- Callouts -->
      <div class="flex items-center gap-1 border-r px-2">
        <button class="rounded p-1 text-sm text-blue-600 hover:bg-gray-200" on:click={() => setCallout('info')} title="Info Callout"><Info class="h-4 w-4" /></button>
        <button class="rounded p-1 text-sm text-orange-600 hover:bg-gray-200" on:click={() => setCallout('warning')} title="Warning Callout"
          ><AlertTriangle class="h-4 w-4" /></button
        >
        <button class="rounded p-1 text-sm text-green-600 hover:bg-gray-200" on:click={() => setCallout('tip')} title="Tip Callout"><Lightbulb class="h-4 w-4" /></button>
      </div>

      <!-- Clear Formatting -->
      <div class="flex items-center px-2">
        <button class="rounded p-1 text-sm text-red-500 hover:bg-gray-200" on:click={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting"
          ><Eraser class="h-4 w-4" /></button
        >
      </div>

      <!-- Table Controls (Only visible when in table) -->
    </div>
  {/if}

  <!-- Title Input and Editor Content -->
  <div class="flex flex-1 flex-col px-12 py-10">
    {#if editable}
      <input type="text" bind:value={title} class="mb-4 w-full border-none bg-transparent text-3xl font-bold outline-none placeholder:text-gray-300" placeholder="Lesson Title" />
    {/if}
    <div class="editor-content max-w-full flex-1 overflow-hidden" bind:this={element}></div>
  </div>

  <!-- Table Floating Menu (Manual Positioning) -->
  {#if showTableMenu}
    <div
      class="fixed z-50 flex items-center gap-1 rounded-lg border bg-white p-1 shadow-lg transition-opacity duration-100"
      style="top: {tableMenuPos.top}px; right: {tableMenuPos.right}px;"
    >
      <button class="flex items-center gap-1 rounded p-1 hover:bg-gray-200" title="Add Column Before" on:click={() => editor.chain().focus().addColumnBefore().run()}
        ><PanelLeftOpen class="h-4 w-4" /></button
      >
      <button class="flex items-center gap-1 rounded p-1 hover:bg-gray-200" title="Add Column After" on:click={() => editor.chain().focus().addColumnAfter().run()}
        ><PanelRightOpen class="h-4 w-4" /></button
      >
      <button class="flex items-center gap-1 rounded p-1 text-red-600 hover:bg-gray-200" title="Delete Column" on:click={() => editor.chain().focus().deleteColumn().run()}
        ><Trash2 class="h-4 w-4" /> Col</button
      >
      <div class="mx-1 h-4 w-px bg-gray-300"></div>

      <!-- Cell Background Color -->
      <div class="relative flex items-center justify-center rounded p-1 hover:bg-gray-200" title="Cell Background">
        <div class="h-4 w-4 rounded border border-gray-300" style="background-color: {editor.getAttributes('tableCell').backgroundColor || '#ffffff'}"></div>
        <input
          type="color"
          class="absolute inset-0 cursor-pointer opacity-0"
          on:input={(event) => editor.chain().focus().setCellAttribute('backgroundColor', event.currentTarget.value).run()}
          value={editor.getAttributes('tableCell').backgroundColor || '#ffffff'}
        />
      </div>

      <div class="mx-1 h-4 w-px bg-gray-300"></div>
      <button class="flex items-center gap-1 rounded p-1 hover:bg-gray-200" title="Add Row Above" on:click={() => editor.chain().focus().addRowBefore().run()}
        ><PanelTopOpen class="h-4 w-4" /></button
      >
      <button class="flex items-center gap-1 rounded p-1 hover:bg-gray-200" title="Add Row Below" on:click={() => editor.chain().focus().addRowAfter().run()}
        ><PanelBottomOpen class="h-4 w-4" /></button
      >
      <button class="flex items-center gap-1 rounded p-1 text-red-600 hover:bg-gray-200" title="Delete Row" on:click={() => editor.chain().focus().deleteRow().run()}
        ><Trash2 class="h-4 w-4" /> Row</button
      >
      <div class="mx-1 h-4 w-px bg-gray-300"></div>
      <div class="mx-1 h-4 w-px bg-gray-300"></div>
      <button class="flex items-center gap-1 rounded p-1 text-red-600 hover:bg-red-100" title="Delete Table" on:click={() => editor.chain().focus().deleteTable().run()}
        ><Trash2 class="h-4 w-4" /> Table</button
      >
    </div>
  {/if}

  <!-- Hidden File Input -->
  <input type="file" bind:this={fileInput} accept="image/*" class="hidden" on:change={handleFileSelect} />
</div>

<style>
  /* Basic Callout Styling matching GitBook roughly */
  :global(.callout) {
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 0.5rem;
    border-left: 4px solid;
  }
  :global(.callout-info) {
    background-color: #eff6ff;
    border-color: #3b82f6;
  }
  :global(.callout-warning) {
    background-color: #fff7ed;
    border-color: #f97316;
  }
  :global(.callout-tip) {
    background-color: #f0fdf4;
    border-color: #22c55e;
  }

  /* Task List Styling */
  :global(ul[data-type='taskList']) {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
  }
  :global(li[data-type='taskItem']) {
    display: flex;
    flex-direction: row;
    align-items: center; /* Center aligned vertically */
    gap: 0.75rem;
    margin: 0.25rem 0;
  }
  /* Remove prose markers */
  :global(li[data-type='taskItem']::before),
  :global(li[data-type='taskItem']::marker) {
    content: none !important;
    display: none;
  }

  /* Custom Checkbox Container */
  :global(li[data-type='taskItem'] label) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    user-select: none;
    cursor: pointer;
    contenteditable: false;
  }

  :global(li[data-type='taskItem'] input) {
    appearance: none;
    -webkit-appearance: none;
    background-color: transparent;
    cursor: pointer;
    width: 1.15rem;
    height: 1.15rem;
    border: 1.5px solid #d1d5db; /* Gray-300 */
    border-radius: 0.35rem; /* Slightly rounded */
    transition: all 0.2s ease;
    display: grid;
    place-content: center;
    margin: 0; /* Reset margins */
  }

  /* Hover state */
  :global(li[data-type='taskItem'] input:hover) {
    border-color: #9ca3af; /* Gray-400 */
    background-color: #f9fafb; /* Gray-50 */
  }

  /* Checked state box */
  :global(li[data-type='taskItem'] input:checked) {
    background-color: #000; /* Primary brand color (Black) */
    border-color: #000;
  }

  /* Checkmark Icon using Mask for crisp SVG rendering */
  :global(li[data-type='taskItem'] input::before) {
    content: '';
    width: 0.65rem;
    height: 0.65rem;
    background-color: white;
    transform: scale(0);
    transition: transform 0.1s ease-in-out;

    /* SVG Checkmark */
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
    mask-size: contain;
    -webkit-mask-size: contain;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-position: center;
  }

  :global(li[data-type='taskItem'] input:checked::before) {
    transform: scale(1);
  }

  /* Checked Text Styling - Strikethrough & Faded */
  :global(li[data-type='taskItem'][data-checked='true'] > div) {
    text-decoration: line-through;
    color: #9ca3af; /* Gray-400 */
    opacity: 0.8;
    transition:
      opacity 0.2s,
      color 0.2s;
  }

  /* Reduce default spacing for standard lists too */
  :global(.ProseMirror ul),
  :global(.ProseMirror ol) {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  :global(.ProseMirror li) {
    margin-top: 0.1em;
    margin-bottom: 0.1em;
  }

  :global(.ProseMirror p) {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  :global(.ProseMirror) {
    min-height: 300px;
  }

  /* Blockquote Styling */
  :global(.ProseMirror blockquote) {
    border-left: 3px solid #e5e7eb;
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    font-style: italic;
    color: #4b5563;
  }
  :global(.ProseMirror blockquote::before),
  :global(.ProseMirror blockquote::after) {
    content: none;
  }

  /* Table Styling */
  /* Table Styling */
  :global(.ProseMirror table) {
    border-collapse: separate;
    border-spacing: 0;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem; /* Rounded corners */
  }
  :global(.ProseMirror td),
  :global(.ProseMirror th) {
    box-sizing: border-box;
    min-width: 1em;
    padding: 6px 8px;
    position: relative;
    vertical-align: top;
    border-right: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
  }
  /* Remove right border from last column to prevent double border with table container */
  :global(.ProseMirror td:last-child),
  :global(.ProseMirror th:last-child) {
    border-right: none;
  }
  /* Remove bottom border from last row cells */
  :global(.ProseMirror tr:last-child td) {
    border-bottom: none;
  }

  :global(.ProseMirror th) {
    background-color: #f9fafb;
    font-weight: 600;
    text-align: left;
  }
  :global(.ProseMirror .selectedCell:after) {
    background: rgba(200, 200, 255, 0.4);
    content: '';
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
  }
  :global(.ProseMirror .column-resize-handle) {
    background-color: #3b82f6; /* Visible blue handle on hover */
    bottom: -2px;
    position: absolute;
    right: -2px;
    top: 0;
    width: 4px;
    z-index: 20;
    cursor: col-resize; /* Ensure cursor changes */
    opacity: 0;
    transition: opacity 0.2s;
  }
  :global(.ProseMirror .column-resize-handle:hover),
  :global(.ProseMirror th:hover .column-resize-handle),
  :global(.ProseMirror td:hover .column-resize-handle) {
    opacity: 1; /* Show on hover */
  }
  /* Image Styling */
  :global(.ProseMirror img) {
    max-width: 100%;
    height: auto;
    margin: 1.5rem auto; /* Center by default with margin */
    display: block; /* Important for auto margin centering */
    border-radius: 0.5rem;
    box-shadow:
      0 1px 3px 0 rgb(0 0 0 / 0.1),
      0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  /* Video/Iframe Styling */
  :global(.ProseMirror .iframe-wrapper) {
    width: 100%;
    margin: 1.5rem 0;
    display: flex;
    justify-content: center;
  }
  :global(.ProseMirror iframe) {
    max-width: 100%;
    margin: 0 auto;
    border-radius: 0.5rem;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
</style>
