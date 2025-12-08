<script lang="ts">
  import { ChevronLeft, Save, Sparkles, Loader2 } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { enhance } from '$app/forms';

  let { data } = $props();
  let tool = $derived(data.tool || {});
  
  let isGenerating = $state(false);

  // Helper bindings (svelte 5 form handling is cleaner but for speed we rely on name attributes or simple binds)
  // For pre-filling, we can use value={tool.name} etc.
</script>

<div class="max-w-3xl mx-auto">
  <div class="flex items-center gap-4 mb-8">
    <Button variant="ghost" size="icon" href="/admin/toolz">
      <ChevronLeft class="w-4 h-4" />
    </Button>
    <h1 class="text-2xl font-bold">{data.tool ? 'Edit Tool' : 'New Tool'}</h1>
  </div>

  <form method="POST" action="?/save" use:enhance class="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="text-sm font-medium">Name</label>
        <Input name="name" value={tool.name} placeholder="e.g. Figma" required />
      </div>
      
      <div class="space-y-2">
        <label class="text-sm font-medium">Website URL</label>
        <Input name="url" value={tool.url} placeholder="https://..." required />
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Short Description</label>
      <Textarea name="shortDescription" value={tool.shortDescription} placeholder="Brief summary..." rows={3} required />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="text-sm font-medium">Image URL</label>
        <Input name="imageUrl" value={tool.imageUrl} placeholder="https://..." />
      </div>
      
      <div class="space-y-2">
        <label class="text-sm font-medium">Pricing</label>
        <select name="pricing" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={tool.pricing || 'freemium'}>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
            <option value="freemium">Freemium</option>
        </select>
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Tags (comma separated)</label>
      <Input name="tags" value={tool.tags?.join(', ')} placeholder="Design, AI, Prototype" />
    </div>

    <div class="flex items-center gap-3 pt-4 border-t border-gray-50">
       <input type="checkbox" name="isActive" id="isActive" class="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" checked={tool.isActive ?? true} />
       <label for="isActive" class="text-sm font-medium">Active (Visible to public)</label>
    </div>

    <div class="flex justify-end gap-3 pt-4">
       <!-- AI Magic placeholder -->
       <Button type="button" variant="outline" class="mr-auto text-violet-600 border-violet-200 bg-violet-50 hover:bg-violet-100" onclick={() => alert('AI Generation coming soon!')}>
          <Sparkles class="w-4 h-4 mr-2" /> Auto-fill with AI
       </Button>

       <Button variant="ghost" href="/admin/toolz">Cancel</Button>
       <Button type="submit" class="bg-violet-600 hover:bg-violet-700 text-white min-w-[120px]">
          <Save class="w-4 h-4 mr-2" /> Save Tool
       </Button>
    </div>

  </form>
</div>
