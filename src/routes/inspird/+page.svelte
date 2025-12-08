<script lang="ts">
  import { Search, Sparkles, Filter, ExternalLink, Heart, Loader2, Share2 } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';

  let { data } = $props();
  
  let mode = $state<'explore' | 'ask'>('explore');
  let searchQuery = $state('');
  let isAsking = $state(false);
  let aiResponse = $state('');
  
  let inspirations = $derived(data.inspirations || []);
  let askQuery = $state('');

  async function submitAskAI() {
     if (!askQuery.trim()) return;
     isAsking = true;
     try {
         const res = await fetch('/api/ai/inspird/recommend', {
             method: 'POST',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({ query: askQuery, mode: 'chat' })
         });
         const result = await res.json();
         aiResponse = result.message || "Here is some inspiration";
         mode = 'explore'; 
     } catch (e) {
         console.error(e);
     } finally {
         isAsking = false;
     }
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-7xl">
  <!-- Header / Toggle -->
  <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
    <div>
      <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Inspird</h1>
      <p class="text-gray-500 mt-2">Fuel your creativity with curated designs.</p>
    </div>
    
    <div class="bg-gray-100 p-1 rounded-lg flex items-center">
      <button 
        class="px-4 py-2 rounded-md font-medium text-sm transition-all {mode === 'explore' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}"
        onclick={() => mode = 'explore'}
      >
        <Search class="w-4 h-4 inline-block mr-2" />
        Explore
      </button>
      <button 
        class="px-4 py-2 rounded-md font-medium text-sm transition-all {mode === 'ask' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:text-black'}"
        onclick={() => mode = 'ask'}
      >
        <Sparkles class="w-4 h-4 inline-block mr-2" />
        Ask AI
      </button>
    </div>
  </div>

  {#if mode === 'explore'}
    <!-- Search UI -->
    <div class="mb-8 space-y-4">
      <div class="flex flex-wrap gap-2 items-center text-sm">
        <Filter class="w-4 h-4 text-gray-500 mr-2" />
        <Button variant="outline" size="sm" class="rounded-full">All</Button>
        <Button variant="ghost" size="sm" class="rounded-full">Branding</Button>
        <Button variant="ghost" size="sm" class="rounded-full">UI/UX</Button>
        <Button variant="ghost" size="sm" class="rounded-full">Motion</Button>
        <Button variant="ghost" size="sm" class="rounded-full">Typography</Button>
      </div>

      {#if aiResponse}
        <div class="bg-pink-50 border border-pink-100 p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <Sparkles class="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
          <p class="text-pink-900">{aiResponse}</p>
        </div>
      {/if}
    </div>

    <!-- Masonry-like Grid -->
    <div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {#if inspirations.length === 0}
        <div class="col-span-full text-center py-12 text-gray-500">
          <p>No invitations found. Creating seed data...</p> <!-- Temporary debug message -->
        </div>
      {/if}
      {#each inspirations as item}
        <div class="break-inside-avoid group relative rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in">
          <img src={item.thumbnailUrl} alt={item.title} class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
          
          <!-- Hover Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
            <div class="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Badge variant="secondary" class="mb-2 bg-white/20 hover:bg-white/30 text-white border-none">{item.tags ? item.tags[0] : 'Art'}</Badge>
              <h3 class="text-lg font-bold leading-tight">{item.title}</h3>
              <div class="flex items-center justify-between mt-3">
                <span class="text-sm text-gray-300">by {item.creatorName}</span>
                <div class="flex gap-2">
                  <button class="bg-white/20 p-2 rounded-full hover:bg-white hover:text-red-500 transition-colors">
                    <Heart class="w-4 h-4" />
                  </button>
                  <button class="bg-white/20 p-2 rounded-full hover:bg-white hover:text-black transition-colors">
                    <ExternalLink class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>

  {:else}
    <!-- Ask AI UI -->
    <div class="max-w-2xl mx-auto py-12 text-center">
      <div class="inline-flex p-4 rounded-full bg-pink-100 mb-6">
        <Sparkles class="w-8 h-8 text-pink-600" />
      </div>
      <h2 class="text-2xl font-bold mb-4">What inspires you today?</h2>
      <p class="text-gray-500 mb-8">Describe the mood, style, or color palette you're looking for. AI will curate a gallery just for you.</p>
      
      <div class="relative bg-white border border-gray-200 shadow-sm rounded-xl p-2 focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-transparent transition-all">
        <textarea 
          class="w-full min-h-[120px] p-4 resize-none outline-none text-lg" 
          placeholder="I'm looking for dark, futuristic UI designs with neon accents..."
        ></textarea>
        <div class="flex justify-end p-2 border-t border-gray-100">
          <Button onclick={handleAskAI} disabled={isAsking} class="bg-pink-600 hover:bg-pink-700 text-white font-bold">
            {#if isAsking}
              <Loader2 class="w-4 h-4 mr-2 animate-spin" /> Curating...
            {:else}
              <Sparkles class="w-4 h-4 mr-2" /> Get Inspired
            {/if}
          </Button>
        </div>
      </div>
    </div>
  {/if}

</div>
