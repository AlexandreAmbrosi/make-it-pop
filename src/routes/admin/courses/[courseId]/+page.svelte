<script lang="ts">
  import { enhance } from '$app/forms'
  import type { PageData } from './$types'
  import { page } from '$app/stores'
  import TiptapEditor from '$lib/components/editor/TiptapEditor.svelte'
  import { dndzone, type DndEvent } from 'svelte-dnd-action'
  import { flip } from 'svelte/animate'
  import { GripVertical, Plus, Trash2, FileText, Folder, ChevronRight, ChevronLeft, List } from 'lucide-svelte'
  import * as Popover from '$lib/components/ui/popover'
  import EmojiPicker from '$lib/components/ui/EmojiPicker.svelte'

  export let data: PageData

  let { course, parts, lessons } = data

  // State
  let activeTab = 'builder' // 'metadata', 'builder'
  let selectedLessonId: string | null = null
  let selectedLessonContent = '<p>Select a lesson to edit...</p>' // Placeholder content
  let selectedLessonTitle = ''
  let headings: { level: number; text: string; pos: number }[] = []
  let editorComponent: TiptapEditor
  let showOutline = true

  // Group lessons by part for display
  $: lessonsByPart = lessons.reduce(
    (acc, lesson) => {
      if (!acc[lesson.partId]) acc[lesson.partId] = []
      acc[lesson.partId].push(lesson)
      return acc
    },
    {} as Record<string, typeof lessons>,
  )

  // Sync title changes back to lessons array for sidebar updates
  $: if (selectedLessonId && selectedLessonTitle) {
    const idx = lessons.findIndex((l) => l.id === selectedLessonId)
    if (idx !== -1 && lessons[idx].title !== selectedLessonTitle) {
      lessons[idx].title = selectedLessonTitle
      lessons = [...lessons]
    }
  }

  // Derived state for View Live link
  $: firstLesson = lessons.length > 0 ? lessons[0] : null
  $: viewLiveUrl = firstLesson ? `/learn/course/${course.slug}/${firstLesson.slug}` : `/learn/${course.slug}`

  // Handlers
  async function addChapter() {
    const title = prompt('Chapter Title:')
    if (!title) return

    const res = await fetch(`/api/courses/${course.id}/chapters`, {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      const newPart = await res.json()
      parts = [...parts, newPart]
      lessonsByPart = { ...lessonsByPart } // Trigger reactivity
    }
  }

  async function updateChapter(chapterId: string, updates: { title?: string; icon?: string }) {
    const res = await fetch(`/api/courses/${course.id}/chapters/${chapterId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      const updated = await res.json()
      const idx = parts.findIndex((p) => p.id === chapterId)
      if (idx !== -1) {
        parts[idx] = { ...parts[idx], ...updated }
        parts = [...parts] // trigger reactivity
      }
    }
  }

  async function addLesson(partId: string) {
    const title = prompt('Lesson Title:')
    if (!title) return

    const res = await fetch(`/api/courses/${course.id}/chapters/${partId}/lessons`, {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      const newLesson = await res.json()
      lessons = [...lessons, newLesson]
      // Update grouped
      if (!lessonsByPart[partId]) lessonsByPart[partId] = []
      lessonsByPart[partId].push(newLesson)
      lessonsByPart = { ...lessonsByPart }
      selectLesson(newLesson.id)
    }
  }

  function selectLesson(id: string) {
    selectedLessonId = id
    const l = lessons.find((x) => x.id === id)
    selectedLessonContent = l?.content || ''
    selectedLessonTitle = l?.title || ''
  }

  async function saveLesson() {
    if (!selectedLessonId) return

    // Get content from bound variable
    // const currentLesson = lessons.find((l) => l.id === selectedLessonId)
    // const title = currentLesson?.title // In case we want to edit title too

    const res = await fetch(`/api/lessons/${selectedLessonId}`, {
      method: 'PUT',
      body: JSON.stringify({
        content: selectedLessonContent,
        title: selectedLessonTitle,
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      const updated = await res.json()
      const idx = lessons.findIndex((l) => l.id === selectedLessonId)
      if (idx !== -1) {
        lessons[idx] = updated
      }
      alert('Saved!')
    } else {
      alert('Failed to save')
    }
  }
  // Drag and Drop Handlers
  function handleSortChapters(e: CustomEvent<DndEvent<(typeof parts)[0]>>) {
    parts = e.detail.items
  }

  async function handleSortChaptersFinalize(e: CustomEvent<DndEvent<(typeof parts)[0]>>) {
    parts = e.detail.items
    const orderedIds = parts.map((p) => p.id)
    await fetch(`/api/courses/${course.id}/chapters/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ orderedIds }),
      headers: { 'Content-Type': 'application/json' },
    })
  }

  function handleSortLessons(e: CustomEvent<DndEvent<(typeof lessons)[0]>>, partId: string) {
    lessonsByPart[partId] = e.detail.items
  }

  async function handleSortLessonsFinalize(e: CustomEvent<DndEvent<(typeof lessons)[0]>>, partId: string) {
    lessonsByPart[partId] = e.detail.items
    const orderedIds = lessonsByPart[partId].map((l) => l.id)

    // Optimistic UI update: update the master `lessons` array to reflect new order if needed,
    // but lessonsByPart is the source of truth for the view.

    await fetch(`/api/courses/${course.id}/chapters/${partId}/lessons/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ orderedIds }),
      headers: { 'Content-Type': 'application/json' },
    })
  }
</script>

<div class="flex h-[calc(100vh-64px)] flex-col">
  <!-- Header -->
  <header class="flex items-center justify-between border-b bg-white px-6 py-3">
    <div class="flex items-center gap-4">
      <h1 class="text-xl font-bold">{course.title}</h1>
      <div class="flex rounded-lg bg-gray-100 p-1 text-sm">
        <button class="rounded-md px-3 py-1 {activeTab === 'builder' ? 'bg-white shadow' : 'text-gray-500'}" on:click={() => (activeTab = 'builder')}> Builder </button>
        <button class="rounded-md px-3 py-1 {activeTab === 'metadata' ? 'bg-white shadow' : 'text-gray-500'}" on:click={() => (activeTab = 'metadata')}> Settings </button>
      </div>
    </div>
    <div class="flex gap-2">
      <a href={viewLiveUrl} target="_blank" class="px-3 py-1 text-sm text-blue-600 hover:underline">View Live</a>
      <button class="rounded-md bg-black px-4 py-2 text-sm text-white" on:click={saveLesson}>Save Changes</button>
    </div>
  </header>

  <!-- Content -->
  <div class="flex flex-1 overflow-hidden">
    {#if activeTab === 'metadata'}
      <div class="mx-auto w-full max-w-2xl overflow-y-auto p-8">
        <form method="POST" action="?/updateMetadata" use:enhance class="space-y-6">
          <div>
            <label for="course-title" class="mb-1 block text-sm font-medium">Title</label>
            <input id="course-title" type="text" name="title" value={course.title} class="w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label for="course-slug" class="mb-1 block text-sm font-medium">Slug (URL)</label>
            <input id="course-slug" type="text" name="slug" value={course.slug} class="w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label for="course-description" class="mb-1 block text-sm font-medium">Description</label>
            <textarea id="course-description" name="description" rows="4" class="w-full rounded-md border px-3 py-2">{course.description || ''}</textarea>
          </div>
          <button type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-white">Update Settings</button>
        </form>
      </div>
    {:else}
      <!-- Builder View -->
      <!-- Sidebar: Structure -->
      <aside class="flex w-80 flex-col overflow-hidden border-r bg-gray-50">
        <div class="flex items-center justify-between border-b p-4">
          <span class="text-sm font-semibold text-gray-700">Course Structure</span>
          <button class="flex items-center gap-1 text-xs text-blue-600 hover:underline" on:click={addChapter}>
            <Plus class="h-3 w-3" /> Chapter
          </button>
        </div>

        <div
          class="flex-1 space-y-4 overflow-y-auto p-2"
          use:dndzone={{ items: parts, flipDurationMs: 300, dropTargetStyle: {} }}
          on:consider={handleSortChapters}
          on:finalize={handleSortChaptersFinalize}
        >
          <!-- Temporary UI without full DnD logic for first pass -->
          {#each parts as part (part.id)}
            <div class="overflow-hidden rounded-md border bg-white" animate:flip={{ duration: 300 }}>
              <div class="group flex items-center justify-between border-b bg-gray-100 p-2">
                <div class="flex items-center gap-2">
                  <GripVertical class="h-4 w-4 cursor-grab text-gray-400" />
                  <Popover.Root>
                    <Popover.Trigger class="flex h-6 w-6 items-center justify-center rounded hover:bg-white" title="Change Icon">
                      {part.icon || '📁'}
                    </Popover.Trigger>
                    <Popover.Content class="w-auto border-none bg-transparent p-0 shadow-none" side="right" align="start">
                      <div class="overflow-hidden rounded-xl border bg-white shadow-xl">
                        <EmojiPicker
                          on:emoji-click={(e) => {
                            updateChapter(part.id, { icon: e.detail.unicode })
                            // Close popover logic would need `bind:open` or a store if we want auto-close,
                            // but standard Popover usually stays open or closes on click outside.
                            // To auto-close, we might need a controlled state per item which is complex in a loop.
                            // For now, let's let user click outside or we can try to find a way to close.
                            // Actually bits-ui popover might not auto-close on content click unless we force it.
                          }}
                        />
                      </div>
                    </Popover.Content>
                  </Popover.Root>
                  <span class="text-sm font-medium">{part.title}</span>
                </div>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100">
                  <button class="rounded p-1 hover:bg-gray-200" on:click={() => addLesson(part.id)}><Plus class="h-3 w-3" /></button>
                  <button class="rounded p-1 text-red-500 hover:bg-gray-200"><Trash2 class="h-3 w-3" /></button>
                </div>
              </div>

              <div
                class="space-y-1 p-1"
                use:dndzone={{ items: lessonsByPart[part.id] || [], flipDurationMs: 200, dropTargetStyle: {} }}
                on:consider={(e) => handleSortLessons(e, part.id)}
                on:finalize={(e) => handleSortLessonsFinalize(e, part.id)}
              >
                {#if lessonsByPart[part.id]}
                  {#each lessonsByPart[part.id] as lesson (lesson.id)}
                    <div animate:flip={{ duration: 200 }}>
                      <button
                        class="flex w-full items-center gap-2 rounded p-2 text-left text-sm hover:bg-gray-50 {selectedLessonId === lesson.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600'}"
                        on:click={() => selectLesson(lesson.id)}
                      >
                        <GripVertical class="h-3 w-3 cursor-move text-gray-300" />
                        <FileText class="h-3 w-3 text-gray-400" />
                        <span class="truncate">{lesson.title}</span>
                      </button>
                    </div>
                  {/each}
                {/if}
              </div>
            </div>
          {/each}

          {#if parts.length === 0}
            <div class="p-8 text-center text-sm text-gray-400">
              No content yet. <br /> Add a chapter to start.
            </div>
          {/if}
        </div>
      </aside>

      <!-- Main: Editor -->
      <main class="relative flex-1 overflow-y-auto bg-white">
        {#if selectedLessonId}
          <div class="h-full w-full space-y-6">
            <!-- Lesson Title Editor -->
            {#key selectedLessonId}
              <TiptapEditor
                bind:this={editorComponent}
                bind:content={selectedLessonContent}
                bind:title={selectedLessonTitle}
                bind:headings
                placeholder="Type '/' for commands..."
              />
            {/key}
          </div>
        {:else}
          <div class="flex h-full flex-col items-center justify-center text-gray-400">
            <FileText class="mb-4 h-12 w-12 opacity-50" />
            <p>Select a lesson from the sidebar to edit content</p>
          </div>
        {/if}
      </main>

      <!-- Right Sidebar: Outline -->
      {#if selectedLessonId}
        <aside class="relative flex flex-col border-l bg-gray-50 transition-all duration-300 {showOutline ? 'w-64' : 'w-12'} overflow-hidden">
          <div class="flex h-14 items-center {showOutline ? 'justify-between px-4' : 'justify-center'} border-b">
            {#if showOutline}
              <span class="text-sm font-semibold whitespace-nowrap text-gray-700">Outline</span>
            {/if}
            <button class="rounded p-1 hover:bg-gray-200" on:click={() => (showOutline = !showOutline)} title={showOutline ? 'Collapse' : 'Expand Outline'}>
              {#if showOutline}
                <ChevronRight class="h-4 w-4" />
              {:else}
                <List class="h-4 w-4" />
              {/if}
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-4 {showOutline ? 'opacity-100' : 'invisible opacity-0'} transition-opacity duration-200">
            {#if headings.length > 0}
              <div class="space-y-1">
                {#each headings as h}
                  <button
                    class="block w-full truncate text-left text-sm hover:text-blue-600 hover:underline"
                    style="padding-left: {(h.level - 1) * 0.75}rem; font-size: {h.level === 1 ? '0.9rem' : '0.8rem'}; font-weight: {h.level === 1 ? '600' : '400'}"
                    on:click={() => editorComponent.scrollToPos(h.pos)}
                  >
                    {h.text}
                  </button>
                {/each}
              </div>
            {:else}
              <p class="text-xs text-gray-400">Add headings (H1-H3) to see an outline.</p>
            {/if}
          </div>
        </aside>
      {/if}
    {/if}
  </div>
</div>
