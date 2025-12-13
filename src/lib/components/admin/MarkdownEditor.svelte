<script lang="ts">
  import {
    Bold,
    Italic,
    Link,
    List,
    ListOrdered,
    Image as ImageIcon,
    Quote,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Eye,
    Pencil,
    Maximize2,
    Minimize2,
    Columns,
    Undo,
    Redo,
  } from 'lucide-svelte'
  import { marked } from 'marked'
  import { Button } from '$lib/components/ui/button'
  import * as Popover from '$lib/components/ui/popover'
  import { cn } from '$lib/utils'

  let { value = $bindable(''), name = '', id = '', placeholder = '', rows = 15, class: className = '' } = $props()

  let textarea = $state<HTMLTextAreaElement>()
  let viewMode = $state<'write' | 'split' | 'preview'>('write')
  let isFullScreen = $state(false)

  // History State
  let history = $state<string[]>([])
  let historyIndex = $state(-1)
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  // Initialize history with initial value
  $effect(() => {
    if (history.length === 0 && value) {
      history = [value]
      historyIndex = 0
    }
  })

  function saveHistory(immediate = false) {
    const val = value

    // Don't save if duplicate of current head
    if (history.length > 0 && history[historyIndex] === val) return

    if (immediate) {
      if (debounceTimer) clearTimeout(debounceTimer)
      _pushHistory(val)
    } else {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        _pushHistory(val)
      }, 500)
    }
  }

  function _pushHistory(val: string) {
    // If we undid back, remove future history
    if (historyIndex < history.length - 1) {
      history = history.slice(0, historyIndex + 1)
    }
    history.push(val)
    historyIndex++
    // Limit history size? standard is usually ~50-100.
    if (history.length > 50) {
      history.shift()
      historyIndex--
    }
  }

  function undo() {
    if (historyIndex > 0) {
      historyIndex--
      value = history[historyIndex]
    }
  }

  function redo() {
    if (historyIndex < history.length - 1) {
      historyIndex++
      value = history[historyIndex]
    }
  }

  function insert(prefix: string, suffix: string = '') {
    if (!textarea) return

    // Save state before modification
    saveHistory(true)

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = value
    const before = text.substring(0, start)
    const selection = text.substring(start, end)
    const after = text.substring(end)

    value = before + prefix + selection + suffix + after

    // Save state after modification
    saveHistory(true)

    // Restore focus and cursor positions via tick/timeout
    setTimeout(() => {
      if (!textarea) return
      textarea.focus()
      if (selection) {
        textarea.setSelectionRange(start + prefix.length, end + prefix.length)
      } else {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length)
      }
    }, 0)
  }

  function handleKeydown(e: KeyboardEvent) {
    // Undo/Redo
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault()
      if (e.shiftKey) redo()
      else undo()
      return
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault()
      redo()
      return
    }

    // Formatting Shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault()
      insert('**', '**')
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault()
      insert('*', '*')
    }
  }

  function handleInput() {
    // Trigger debounced save
    saveHistory(false)
  }

  // --- Smart Formatting & Interactions ---

  // Smart Toggle for Bold/Italic/Code
  function toggleFormatting(token: string) {
    if (!textarea) return
    saveHistory(true)

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const len = token.length
    const text = value

    // Check availability
    const before = text.substring(start - len, start)
    const after = text.substring(end, end + len)

    if (before === token && after === token) {
      // Unwrap (Remove)
      value = text.substring(0, start - len) + text.substring(start, end) + text.substring(end + len)
      setTimeout(() => {
        if (!textarea) return
        textarea.focus()
        textarea.setSelectionRange(start - len, end - len)
      }, 0)
    } else {
      // Wrap (Add)
      insert(token, token)
    }
  }

  // Link Handling
  let isLinkOpen = $state(false)
  let linkText = $state('')
  let linkUrl = $state('')

  $effect(() => {
    if (isLinkOpen && textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      if (start !== end) {
        linkText = value.substring(start, end)
      }
    }
  })

  function insertLink() {
    const md = `[${linkText || 'link'}](${linkUrl})`
    insert(md) // simple insert
    isLinkOpen = false
    linkText = ''
    linkUrl = ''
  }

  // Image Upload
  let fileInput = $state<HTMLInputElement>()
  let isUploading = $state(false)

  async function handleImageUpload(e: Event) {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    isUploading = true
    try {
      // 1. Get Presigned URL
      const res = await fetch(`/api/storage?type=${file.type}&name=${encodeURIComponent(file.name)}`, {
        method: 'POST',
      })
      const { publicUploadUrl } = await res.json()

      if (!publicUploadUrl) throw new Error('Failed to get upload URL')

      // 2. Upload to S3
      await fetch(publicUploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })

      // 3. Insert Markdown Image
      // Using the proxy endpoint to display it
      const imageUrl = `/api/storage?file=${encodeURIComponent(file.name)}&redirect=true`
      const md = `\n![${file.name}](${imageUrl})\n`
      insert(md)
    } catch (err) {
      console.error(err)
      alert('Image upload failed')
    } finally {
      isUploading = false
      if (fileInput) fileInput.value = ''
    }
  }

  let previewHtml = $derived(marked.parse(value || ''))
</script>

<div class={cn('flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm', isFullScreen && 'fixed inset-0 z-50 h-screen', className)}>
  <!-- Toolbar -->
  <div class="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-gray-50 px-2 py-2 select-none">
    <!-- Undo / Redo -->
    <div class="mr-2 flex items-center gap-1 border-r border-gray-200 pr-2">
      <Button variant="ghost" size="icon" class="h-8 w-8" onclick={undo} disabled={historyIndex <= 0} title="Undo (Ctrl+Z)" type="button">
        <Undo class="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" class="h-8 w-8" onclick={redo} disabled={historyIndex >= history.length - 1} title="Redo (Ctrl+Y)" type="button">
        <Redo class="h-4 w-4" />
      </Button>
    </div>

    <!-- Formatting Tools -->
    <div class={cn('flex items-center gap-1 transition-opacity', viewMode === 'preview' && 'pointer-events-none opacity-50')}>
      <Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => toggleFormatting('**')} title="Bold" type="button">
        <Bold class="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => toggleFormatting('*')} title="Italic" type="button">
        <Italic class="h-4 w-4" />
      </Button>

      <div class="mx-1 h-4 w-px bg-gray-200"></div>

      <Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => insert('### ')} title="Heading 3" type="button">
        <Heading3 class="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => insert('## ')} title="Heading 2" type="button">
        <Heading2 class="h-4 w-4" />
      </Button>

      <div class="mx-1 h-4 w-px bg-gray-200"></div>

      <Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => insert('- ')} title="Bullet List" type="button">
        <List class="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => insert('1. ')} title="Ordered List" type="button">
        <ListOrdered class="h-4 w-4" />
      </Button>

      <div class="mx-1 h-4 w-px bg-gray-200"></div>

      <Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => insert('> ')} title="Quote" type="button">
        <Quote class="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => toggleFormatting('`')} title="Code" type="button">
        <Code class="h-4 w-4" />
      </Button>

      <div class="mx-1 h-4 w-px bg-gray-200"></div>

      <Popover.Root bind:open={isLinkOpen}>
        <Popover.Trigger>
          <Button variant="ghost" size="icon" class="h-8 w-8" title="Link" type="button">
            <Link class="h-4 w-4" />
          </Button>
        </Popover.Trigger>
        <Popover.Content class="w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <div class="space-y-3">
            <h4 class="text-sm font-medium">Insert Link</h4>
            <div class="space-y-1">
              <label for="link-text-input" class="text-xs font-medium text-gray-500">Text</label>
              <input id="link-text-input" bind:value={linkText} class="w-full rounded border border-gray-300 px-2 py-1 text-sm" placeholder="Link text" />
            </div>
            <div class="space-y-1">
              <label for="link-url-input" class="text-xs font-medium text-gray-500">URL</label>
              <input id="link-url-input" bind:value={linkUrl} class="w-full rounded border border-gray-300 px-2 py-1 text-sm" placeholder="https://..." />
            </div>
            <div class="flex justify-end pt-2">
              <Button size="sm" onclick={insertLink} disabled={!linkUrl}>Insert</Button>
            </div>
          </div>
        </Popover.Content>
      </Popover.Root>

      <Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => fileInput?.click()} title="Image" type="button" disabled={isUploading}>
        {#if isUploading}
          <div class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
        {:else}
          <ImageIcon class="h-4 w-4" />
        {/if}
      </Button>
      <input type="file" bind:this={fileInput} hidden onchange={handleImageUpload} accept="image/*" />
    </div>

    <div class="ml-auto flex items-center gap-2">
      <!-- View Modes -->
      <div class="flex items-center rounded-lg border border-gray-200 bg-white p-0.5">
        <button
          class={cn('flex items-center gap-2 rounded px-2 py-1 text-xs font-medium transition-colors hover:bg-gray-100', viewMode === 'write' && 'bg-gray-100 text-gray-900')}
          onclick={() => (viewMode = 'write')}
          type="button"
        >
          <Pencil class="h-3 w-3" /> Write
        </button>
        <button
          class={cn('flex items-center gap-2 rounded px-2 py-1 text-xs font-medium transition-colors hover:bg-gray-100', viewMode === 'split' && 'bg-gray-100 text-gray-900')}
          onclick={() => (viewMode = 'split')}
          type="button"
          title="Split View"
        >
          <Columns class="h-3 w-3" /> Split
        </button>
        <button
          class={cn('flex items-center gap-2 rounded px-2 py-1 text-xs font-medium transition-colors hover:bg-gray-100', viewMode === 'preview' && 'bg-gray-100 text-gray-900')}
          onclick={() => (viewMode = 'preview')}
          type="button"
        >
          <Eye class="h-3 w-3" /> Preview
        </button>
      </div>

      <div class="mx-1 h-4 w-px bg-gray-200"></div>

      <Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => (isFullScreen = !isFullScreen)} title="Toggle Fullscreen" type="button">
        {#if isFullScreen}
          <Minimize2 class="h-4 w-4" />
        {:else}
          <Maximize2 class="h-4 w-4" />
        {/if}
      </Button>
    </div>
  </div>

  <!-- Editor / Preview Area -->
  <div class="relative flex min-h-[300px] flex-1 overflow-hidden bg-white">
    <!-- Editor Pane -->
    {#if viewMode === 'write' || viewMode === 'split'}
      <div class={cn('flex flex-col', viewMode === 'split' ? 'w-1/2 border-r border-gray-200' : 'w-full')}>
        <textarea
          bind:this={textarea}
          bind:value
          {name}
          {id}
          {placeholder}
          {rows}
          onkeydown={handleKeydown}
          oninput={handleInput}
          class="w-full flex-1 resize-none border-0 bg-transparent p-4 font-mono text-sm leading-relaxed text-gray-900 focus:ring-0 focus:outline-none"
        ></textarea>
      </div>
    {/if}

    <!-- Preview Pane -->
    {#if viewMode === 'preview' || viewMode === 'split'}
      <div class={cn('overflow-y-auto bg-gray-50/50', viewMode === 'split' ? 'w-1/2' : 'w-full')}>
        <div class="prose prose-sm max-w-none p-8">
          {@html previewHtml}
        </div>
      </div>
    {/if}
  </div>

  <div class="flex justify-between border-t border-gray-100 bg-gray-50 px-3 py-1 text-xs text-gray-400">
    <span>Markdown supported</span>
    <span>{value.length} chars</span>
  </div>
</div>
