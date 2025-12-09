<script lang="ts">
  import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-svelte'
  import { toast } from 'svelte-sonner'
  import { Button } from '$lib/components/ui/button'
  import { Badge } from '$lib/components/ui/badge'
  import { enhance } from '$app/forms'

  let { data } = $props()
  let searchTerm = $state('')
  let localTools = $state(data.tools)

  $effect(() => {
    localTools = data.tools
  })

  // Client-side simple search filtering
  let filteredTools = $derived(searchTerm ? localTools.filter((t: any) => t.name.toLowerCase().includes(searchTerm.toLowerCase())) : localTools)

  // Bulk Selection
  let selectedTools = $state(new Set<string>())

  function toggleAll() {
    if (selectedTools.size === filteredTools.length) {
      selectedTools = new Set()
    } else {
      selectedTools = new Set(filteredTools.map((t) => t.id))
    }
  }

  function toggleTool(id: string) {
    const newSet = new Set(selectedTools)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    selectedTools = newSet
  }

  // Inline Editing
  let editingCell = $state<{ id: string; field: string } | null>(null)
  let editValue = $state<string>('')

  function startEdit(tool: any, field: string) {
    editingCell = { id: tool.id, field }
    editValue = String((tool as any)[field])
    // Wait for DOM update to focus input?
    setTimeout(() => {
      const input = document.getElementById(`edit-${tool.id}-${field}`)
      if (input) input.focus()
    }, 0)
  }

  async function saveEdit() {
    if (!editingCell) return
    const { id, field } = editingCell
    const val = editValue

    editingCell = null // Close edit mode immediately

    try {
      const res = await fetch('/api/tools', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: val }),
      })

      if (res.ok) {
        const idx = localTools.findIndex((t: any) => t.id === id)
        if (idx !== -1) {
          localTools[idx][field] = val
          toast.success('Updated successfully')
        }
      } else {
        toast.error('Failed to save')
      }
    } catch (e) {
      console.error(e)
      toast.error('Error saving')
    }
  }

  async function bulkUpdate(updates: any) {
    if (!confirm(`Update ${selectedTools.size} tools?`)) return

    const ids = Array.from(selectedTools)
    try {
      const res = await fetch('/api/tools', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, ...updates }),
      })

      if (res.ok) {
        selectedTools = new Set()
        localTools = localTools.map((t: any) => (ids.includes(t.id) ? { ...t, ...updates } : t))
        toast.success(`Updated ${ids.length} tools`)
      } else {
        toast.error('Batch update failed')
      }
    } catch (e) {
      console.error(e)
      toast.error('Batch update error')
    }
  }

  async function bulkDelete() {
    if (!confirm(`Delete ${selectedTools.size} tools?`)) return

    // ... existing delete logic ...
    const ids = Array.from(selectedTools)
    try {
      const res = await fetch('/api/tools', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })

      if (res.ok) {
        selectedTools = new Set()
        localTools = localTools.filter((t: any) => !ids.includes(t.id))
        toast.success(`Deleted ${ids.length} tools`)
      } else {
        toast.error('Delete failed')
      }
    } catch (e) {
      console.error(e)
      toast.error('Delete error')
    }
  }
</script>

<div class="flex flex-col gap-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Toolz Management</h1>
      <p class="text-gray-500">Manage your curated software and applications.</p>
    </div>
    <Button class="bg-violet-600 text-white hover:bg-violet-700" href="/admin/toolz/new">
      <Plus class="mr-2 h-4 w-4" /> Add New Tool
    </Button>
  </div>

  <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <Search class="h-5 w-5 text-gray-400" />
    <input type="text" placeholder="Search tools..." class="flex-1 bg-transparent outline-none" bind:value={searchTerm} />
  </div>

  <div class="overflow-hidden rounded-xl border bg-white shadow-sm">
    <table class="w-full text-left text-sm">
      <thead class="bg-gray-50 font-medium text-gray-500">
        <tr>
          <th class="w-10 px-6 py-4">
            <input type="checkbox" checked={selectedTools.size === filteredTools.length && filteredTools.length > 0} onclick={toggleAll} class="rounded border-gray-300" />
          </th>
          <th class="px-6 py-4">Name</th>
          <th class="px-6 py-4">Category</th>
          <th class="px-6 py-4">Status</th>
          <th class="px-6 py-4">Pricing</th>
          <th class="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        {#each filteredTools as tool}
          <tr class="group transition-colors hover:bg-gray-50">
            <td class="px-6 py-4">
              <input type="checkbox" checked={selectedTools.has(tool.id)} onclick={() => toggleTool(tool.id)} class="rounded border-gray-300" />
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <!-- Image (Non-editable for now) -->
                <div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {#if tool.imageUrl}
                    <img src={tool.imageUrl} alt="" class="h-full w-full object-cover" />
                  {:else}
                    <div class="flex h-full w-full items-center justify-center font-bold text-gray-300">?</div>
                  {/if}
                </div>
                <!-- Editable Name -->
                <div class="w-full" onclick={() => startEdit(tool, 'name')}>
                  {#if editingCell?.id === tool.id && editingCell?.field === 'name'}
                    <input
                      id={`edit-${tool.id}-name`}
                      type="text"
                      bind:value={editValue}
                      onblur={saveEdit}
                      onkeydown={(e) => e.key === 'Enter' && saveEdit()}
                      class="w-full rounded border px-1 py-0.5 text-sm"
                    />
                  {:else}
                    <div class="-ml-1 cursor-pointer rounded px-1 font-medium text-gray-900 hover:bg-gray-100">{tool.name}</div>
                    <a href={tool.url} target="_blank" class="block max-w-[150px] truncate text-xs text-gray-400 hover:underline" onclick={(e) => e.stopPropagation()}>{tool.url}</a
                    >
                  {/if}
                </div>
              </div>
            </td>
            <td class="px-6 py-4" onclick={() => startEdit(tool, 'type')}>
              {#if editingCell?.id === tool.id && editingCell?.field === 'type'}
                <select id={`edit-${tool.id}-type`} bind:value={editValue} onblur={saveEdit} onchange={saveEdit} class="w-full rounded border px-1 py-0.5 text-xs">
                  <option value="Online Tool">Online Tool</option>
                  <option value="App/Software">App/Software</option>
                  <option value="Chrome Extension">Chrome Extension</option>
                  <option value="Plugin">Plugin</option>
                  <option value="Resource">Resource</option>
                  <option value="AI">AI</option>
                </select>
              {:else if tool.type}
                <Badge variant="outline" class="cursor-pointer text-xs hover:bg-gray-100">{tool.type}</Badge>
              {:else}
                <span class="cursor-pointer text-gray-400">-</span>
              {/if}
            </td>
            <td class="px-6 py-4">
              <!-- Status Toggle (Direct Action, simplest) -->
              <form method="POST" action="?/toggle" use:enhance>
                <input type="hidden" name="id" value={tool.id} />
                <input type="hidden" name="isActive" value={(tool.isActive ?? false).toString()} />
                <button class="flex cursor-pointer items-center gap-2 hover:opacity-80 focus:outline-none">
                  <div class={`h-2 w-2 rounded-full ${tool.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span class={tool.isActive ? 'text-green-700' : 'text-gray-500'}>{tool.isActive ? 'Active' : 'Draft'}</span>
                </button>
              </form>
            </td>
            <td class="cursor-pointer rounded px-6 py-4 text-gray-600 capitalize hover:bg-gray-100" onclick={() => startEdit(tool, 'pricing')}>
              {#if editingCell?.id === tool.id && editingCell?.field === 'pricing'}
                <select id={`edit-${tool.id}-pricing`} bind:value={editValue} onblur={saveEdit} onchange={saveEdit} class="w-full rounded border px-1 py-0.5 text-xs">
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                </select>
              {:else}
                {tool.pricing || 'Unknown'}
              {/if}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="icon" class="h-8 w-8 text-gray-500 hover:text-blue-600" href={`/admin/toolz/${tool.id}`}>
                  <Pencil class="h-4 w-4" />
                </Button>
                <form method="POST" action="?/delete" use:enhance class="inline">
                  <input type="hidden" name="id" value={tool.id} />
                  <Button variant="ghost" size="icon" class="h-8 w-8 text-gray-500 hover:text-red-600" type="submit">
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if selectedTools.size > 0}
    <div
      class="animate-in slide-in-from-bottom-4 fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full bg-gray-900/90 px-6 py-3 text-white shadow-xl backdrop-blur"
    >
      <span class="text-sm font-medium">{selectedTools.size} selected</span>
      <div class="h-4 w-px bg-white/20"></div>

      <button class="flex items-center gap-2 text-sm transition-colors hover:text-green-300" onclick={() => bulkUpdate({ isActive: true })}>
        <div class="h-2 w-2 rounded-full bg-green-500"></div>
        Active
      </button>

      <button class="flex items-center gap-2 text-sm transition-colors hover:text-gray-300" onclick={() => bulkUpdate({ isActive: false })}>
        <div class="h-2 w-2 rounded-full bg-gray-400"></div>
        Draft
      </button>

      <div class="h-4 w-px bg-white/20"></div>

      <button class="flex items-center gap-2 text-sm transition-colors hover:text-red-300" onclick={bulkDelete}>
        <Trash2 class="h-4 w-4" /> Delete
      </button>

      <button class="ml-2 rounded bg-white px-2 py-1 text-xs text-black hover:bg-gray-200" onclick={() => (selectedTools = new Set())}>Cancel</button>
    </div>
  {/if}
</div>
