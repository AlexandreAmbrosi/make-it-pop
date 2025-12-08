<script lang="ts">
  import { ChevronLeft, Save, Sparkles } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { enhance } from '$app/forms';

  let { data } = $props();
  let item = $derived(data.item || {});
</script>

<div class="max-w-3xl mx-auto">
  <div class="flex items-center gap-4 mb-8">
    <Button variant="ghost" size="icon" href="/admin/inspird">
      <ChevronLeft class="w-4 h-4" />
    </Button>
    <h1 class="text-2xl font-bold">{data.item ? 'Edit Inspiration' : 'New Inspiration'}</h1>
  </div>

  <form method="POST" action="?/save" use:enhance class="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="text-sm font-medium">Creator Name</label>
        <Input name="creatorName" value={item.creatorName} placeholder="e.g. Studio Voila" />
      </div>
      
      <div class="space-y-2">
        <label class="text-sm font-medium">Resource URL (Required)</label>
        <Input name="resourceUrl" value={item.resourceUrl} placeholder="https://dribbble.com/shots/..." required />
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Thumbnail URL</label>
      <div class="flex gap-4">
        <div class="flex-1">
             <Input name="thumbnailUrl" value={item.thumbnailUrl} placeholder="https://..." />
        </div>
        {#if item.thumbnailUrl}
            <div class="w-16 h-10 rounded overflow-hidden bg-gray-100 border">
                <img src={item.thumbnailUrl} alt="" class="w-full h-full object-cover" />
            </div>
        {/if}
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Tags (comma separated)</label>
      <Input name="tags" value={item.tags?.join(', ')} placeholder="Brand, Web, Typography" />
    </div>

    <div class="flex items-center gap-3 pt-4 border-t border-gray-50">
       <input type="checkbox" name="isActive" id="isActive" class="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" checked={item.isActive ?? true} />
       <label for="isActive" class="text-sm font-medium">Active (Visible to public)</label>
    </div>

    <div class="flex justify-end gap-3 pt-4">
       <!-- AI Magic placeholder -->
       <Button type="button" variant="outline" class="mr-auto text-violet-600 border-violet-200 bg-violet-50 hover:bg-violet-100" onclick={() => alert('Ingestion pipeline needed for AI auto-fill!')}>
          <Sparkles class="w-4 h-4 mr-2" /> Auto-fill from URL
       </Button>

       <Button variant="ghost" href="/admin/inspird">Cancel</Button>
       <Button type="submit" class="bg-violet-600 hover:bg-violet-700 text-white min-w-[120px]">
          <Save class="w-4 h-4 mr-2" /> Save Item
       </Button>
    </div>

  </form>
</div>
