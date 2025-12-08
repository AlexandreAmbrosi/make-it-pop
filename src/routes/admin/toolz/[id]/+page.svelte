<script lang="ts">
  import { ChevronLeft, Save, Sparkles, Loader2, ArrowRight } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { enhance } from '$app/forms';

  let { data } = $props();
  // Use mutable state for form fields to allow AI updates
  let tool = $state(data.tool ? { ...data.tool } : {});
  
  let isGenerating = $state(false);
  let magicUrl = $state('');

  async function generateFromUrl() {
      if (!magicUrl) return;
      isGenerating = true;
      
      try {
          const res = await fetch('/api/ai/toolz/ingest', {
              method: 'POST',
              body: JSON.stringify({ url: magicUrl }),
              headers: { 'Content-Type': 'application/json' }
          });
          
          if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.error || 'Failed to analyze');
          }
          
          const { data: aiData } = await res.json();
          
          // Auto-fill form
          tool.name = aiData.name || tool.name;
          tool.shortDescription = aiData.shortDescription || tool.shortDescription;
          tool.pricing = (aiData.pricing || 'freemium').toLowerCase();
          tool.url = magicUrl; 
          
          if (aiData.imageUrl) tool.imageUrl = aiData.imageUrl;
          if (aiData.tags && Array.isArray(aiData.tags)) {
             tool.tags = aiData.tags;
          }

      } catch (e) {
          console.error("Magic Generation Error", e);
          const msg = e instanceof Error ? e.message : "Unknown error";
          alert(`Error: ${msg}. Please check the URL and try again.`);
      } finally {
          isGenerating = false;
      }
  }
</script>

<div class="max-w-3xl mx-auto">
  <div class="flex items-center gap-4 mb-8">
    <Button variant="ghost" size="icon" href="/admin/toolz">
      <ChevronLeft class="w-4 h-4" />
    </Button>
    <h1 class="text-2xl font-bold">{data.tool ? 'Edit Tool' : 'New Tool'}</h1>
  </div>

  <form method="POST" action="?/save" use:enhance class="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
    
    <!-- Magic Ingestion Section -->
    {#if !data.tool} <!-- Only show on creation or if explicitly requested -->
        <div class="p-4 bg-violet-50 rounded-lg border border-violet-100 flex flex-col gap-3">
            <div class="flex items-center gap-2 text-violet-700 font-medium">
                <Sparkles class="w-4 h-4" />
                <span>Magic Auto-Fill</span>
            </div>
            <div class="flex gap-2">
                <Input placeholder="Paste Product URL (e.g. https://ui.shadcn.com)" class="bg-white" bind:value={magicUrl} />
                <Button type="button" onclick={generateFromUrl} disabled={isGenerating} class="bg-violet-600 hover:bg-violet-700 text-white">
                    {#if isGenerating}
                        <Loader2 class="w-4 h-4 animate-spin" />
                    {:else}
                        <ArrowRight class="w-4 h-4" />
                    {/if}
                </Button>
            </div>
            <p class="text-xs text-violet-600/70">Paste a link and our AI will extract the name, description, tags, and pricing.</p>
        </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="text-sm font-medium">Name</label>
        <Input name="name" bind:value={tool.name} placeholder="e.g. Figma" required />
      </div>
      
      <div class="space-y-2">
        <label class="text-sm font-medium">Website URL</label>
        <Input name="url" bind:value={tool.url} placeholder="https://..." required />
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Short Description</label>
      <Textarea name="shortDescription" bind:value={tool.shortDescription} placeholder="Brief summary..." rows={3} required />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="text-sm font-medium">Image URL</label>
        <Input name="imageUrl" bind:value={tool.imageUrl} placeholder="https://..." />
      </div>
      
      <div class="space-y-2">
        <label class="text-sm font-medium">Pricing</label>
        <select name="pricing" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" bind:value={tool.pricing}>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
            <option value="freemium">Freemium</option>
            <option value="contact">Contact</option>
        </select>
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Tags (comma separated)</label>
      <!-- Handling array conversion simply for the input -->
      <Input name="tags" value={tool.tags?.join(', ')} oninput={(e) => tool.tags = e.currentTarget.value.split(',').map(t => t.trim())} placeholder="Design, AI, Prototype" />
    </div>

    <div class="flex items-center gap-3 pt-4 border-t border-gray-50">
       <input type="checkbox" name="isActive" id="isActive" class="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" checked={tool.isActive ?? true} />
       <label for="isActive" class="text-sm font-medium">Active (Visible to public)</label>
    </div>

    <div class="flex justify-end gap-3 pt-4">
       <Button variant="ghost" href="/admin/toolz">Cancel</Button>
       <Button type="submit" class="bg-violet-600 hover:bg-violet-700 text-white min-w-[120px]">
          <Save class="w-4 h-4 mr-2" /> Save Tool
       </Button>
    </div>

  </form>
</div>
