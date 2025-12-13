<script lang="ts">
  import { ChevronLeft, Save, Sparkles, Image as ImageIcon, Trash2, Eye } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Textarea } from '$lib/components/ui/textarea'
  import MarkdownEditor from '$lib/components/admin/MarkdownEditor.svelte'
  import { enhance } from '$app/forms'

  let { data } = $props()
  // Clone to avoid mutation of props if needed, though svelte 5 props are getters.
  // We can use $state for form fields initialized from data.
  let article: any = data.article || {}

  let title = $state(article.title || '')
  let slug = $state(article.slug || '')
  let description = $state(article.description || '')
  let content = $state(article.content || '')
  let imageUrl = $state(article.imageUrl || '')
  let isPublished = $state(article.isPublished ?? false)

  let isGenerating = $state(false)

  async function handleGenerate() {
    if (!title && !data.article) {
      const t = prompt('Enter a topic for the article:')
      if (t) title = t
      else return
    }

    isGenerating = true
    try {
      const res = await fetch('/api/ai/generate-article', {
        method: 'POST',
        body: JSON.stringify({ topic: title }),
        headers: { 'Content-Type': 'application/json' },
      })
      const genData = await res.json()

      if (genData.error) {
        alert('Generation failed: ' + genData.error)
        return
      }

      title = genData.title || title
      slug = genData.slug || slug
      description = genData.description || description
      content = genData.content || content
      imageUrl = genData.imageUrl || imageUrl
    } catch (e) {
      console.error(e)
      alert('Error generating article')
    } finally {
      isGenerating = false
    }
  }
</script>

<div class="mx-auto max-w-4xl">
  <div class="mb-8 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" href="/admin/newz">
        <ChevronLeft class="h-4 w-4" />
      </Button>
      <h1 class="text-2xl font-bold">{data.article ? 'Edit Article' : 'New Article'}</h1>
    </div>

    <Button variant="outline" class="border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100" onclick={handleGenerate} disabled={isGenerating}>
      {#if isGenerating}
        <Sparkles class="mr-2 h-4 w-4 animate-spin" /> Writing...
      {:else}
        <Sparkles class="mr-2 h-4 w-4" /> Generate with AI
      {/if}
    </Button>
  </div>

  <form method="POST" action="?/save" use:enhance class="space-y-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div class="space-y-2">
        <label for="title" class="text-sm font-medium">Title</label>
        <Input id="title" name="title" bind:value={title} placeholder="Article Title" required />
      </div>

      <div class="space-y-2">
        <label for="slug" class="text-sm font-medium">Slug</label>
        <Input id="slug" name="slug" bind:value={slug} placeholder="article-slug" required />
      </div>
    </div>

    <div class="space-y-2">
      <label for="description" class="text-sm font-medium">Description (Excerpt)</label>
      <Textarea id="description" name="description" bind:value={description} placeholder="Brief summary..." rows={2} />
    </div>

    <div class="space-y-2">
      <label for="content" class="text-sm font-medium">Content</label>
      <MarkdownEditor id="content" name="content" bind:value={content} placeholder="# Heading..." rows={20} />
    </div>

    <div class="space-y-2">
      <label for="imageUrl" class="text-sm font-medium">Cover Image URL</label>
      <div class="flex gap-4">
        <div class="flex-1">
          <Input id="imageUrl" name="imageUrl" bind:value={imageUrl} placeholder="https://..." />
        </div>
        {#if imageUrl}
          <div class="group relative h-16 w-24 overflow-hidden rounded border bg-gray-100">
            <img src={imageUrl} alt="" class="h-full w-full object-cover" />
          </div>
        {/if}
      </div>
    </div>

    <!-- Hidden Author field default -->
    <input type="hidden" name="author" value="Make It Pop Team" />

    <div class="flex items-center justify-between border-t border-gray-50 pt-6">
      <div class="flex items-center gap-3">
        <button class="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700" formaction="?/delete">
          <Trash2 class="h-4 w-4" /> Delete
        </button>
      </div>

      <div class="flex items-center gap-3">
        {#if slug}
          <Button variant="ghost" href={`/newz/${slug}`} target="_blank">
            <Eye class="mr-2 h-4 w-4" /> Preview
          </Button>
        {/if}

        <Button variant="outline" type="submit" onclick={() => (isPublished = false)}>Save Draft</Button>

        <Button type="submit" class="min-w-[120px] bg-violet-600 text-white hover:bg-violet-700" onclick={() => (isPublished = true)}>
          <Save class="mr-2 h-4 w-4" />
          {isPublished ? 'Update & Publish' : 'Publish Now'}
        </Button>
      </div>
    </div>
  </form>
</div>
