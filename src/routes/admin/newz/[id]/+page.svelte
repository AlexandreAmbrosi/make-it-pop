<script lang="ts">
  import { ChevronLeft, Save, Sparkles, Image as ImageIcon } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { enhance } from '$app/forms';

  let { data } = $props();
  // Clone to avoid mutation of props if needed, though svelte 5 props are getters.
  // We can use $state for form fields initialized from data.
  let article = data.article || {};
  
  let title = $state(article.title || '');
  let slug = $state(article.slug || '');
  let description = $state(article.description || '');
  let content = $state(article.content || '');
  let imageUrl = $state(article.imageUrl || '');
  let isPublished = $state(article.isPublished ?? false);

  let isGenerating = $state(false);

  async function handleGenerate() {
        if (!title && !data.article) {
             const t = prompt("Enter a topic for the article:");
             if (t) title = t;
             else return;
        }
        
        isGenerating = true;
        try {
            const res = await fetch('/api/ai/generate-article', {
                method: 'POST',
                body: JSON.stringify({ topic: title }),
                headers: { 'Content-Type': 'application/json' }
            });
            const genData = await res.json();
            
            if (genData.error) {
                alert('Generation failed: ' + genData.error);
                return;
            }

            title = genData.title || title;
            slug = genData.slug || slug;
            description = genData.description || description;
            content = genData.content || content;
            imageUrl = genData.imageUrl || imageUrl;

        } catch (e) {
            console.error(e);
            alert('Error generating article');
        } finally {
            isGenerating = false;
        }
  }
</script>

<div class="max-w-4xl mx-auto">
  <div class="flex items-center justify-between mb-8">
    <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" href="/admin/newz">
            <ChevronLeft class="w-4 h-4" />
        </Button>
        <h1 class="text-2xl font-bold">{data.article ? 'Edit Article' : 'New Article'}</h1>
    </div>
    
    <Button variant="outline" class="text-violet-600 border-violet-200 bg-violet-50 hover:bg-violet-100" onclick={handleGenerate} disabled={isGenerating}>
        {#if isGenerating}
            <Sparkles class="w-4 h-4 mr-2 animate-spin" /> Writing...
        {:else}
            <Sparkles class="w-4 h-4 mr-2" /> Generate with AI
        {/if}
    </Button>
  </div>

  <form method="POST" action="?/save" use:enhance class="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-8">
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="text-sm font-medium">Title</label>
        <Input name="title" bind:value={title} placeholder="Article Title" required />
      </div>
      
      <div class="space-y-2">
        <label class="text-sm font-medium">Slug</label>
        <Input name="slug" bind:value={slug} placeholder="article-slug" required />
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Description (Excerpt)</label>
      <Textarea name="description" bind:value={description} placeholder="Brief summary..." rows={2} />
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Content (Markdown)</label>
      <Textarea name="content" bind:value={content} placeholder="# Heading..." rows={15} class="font-mono text-sm" />
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Cover Image URL</label>
      <div class="flex gap-4">
        <div class="flex-1">
             <Input name="imageUrl" bind:value={imageUrl} placeholder="https://..." />
        </div>
        {#if imageUrl}
            <div class="w-24 h-16 rounded overflow-hidden bg-gray-100 border relative group">
                <img src={imageUrl} alt="" class="w-full h-full object-cover" />
            </div>
        {/if}
      </div>
    </div>

    <!-- Hidden Author field default -->
    <input type="hidden" name="author" value="Make It Pop Team" />

    <div class="flex items-center justify-between pt-6 border-t border-gray-50">
       <div class="flex items-center gap-3">
            <input type="checkbox" name="isPublished" id="isPublished" class="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" bind:checked={isPublished} />
            <label for="isPublished" class="text-sm font-medium">Published (Visible to public)</label>
       </div>

       <div class="flex gap-3">
            <Button variant="ghost" href="/admin/newz">Cancel</Button>
            <Button type="submit" class="bg-violet-600 hover:bg-violet-700 text-white min-w-[120px]">
                <Save class="w-4 h-4 mr-2" /> Save Article
            </Button>
       </div>
    </div>

  </form>
</div>
