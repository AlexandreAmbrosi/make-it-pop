<script lang="ts">
  import { Search, Sparkles, Filter, ExternalLink, Heart, Loader2 } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';

  let { data }  = $props();
  
  let mode = $state<'search' | 'ask'>('search');
  let searchQuery = $state('');
  let isAsking = $state(false);
  let aiResponse = $state('');
  
  // Use data.tools for the grid
  let tools = $derived(data.tools || []);

  let askQuery = $state('');

  async function submitAskAI() {
     if (!askQuery.trim()) return;
     isAsking = true;
     try {
         const res = await fetch('/api/ai/toolz/recommend', {
             method: 'POST',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({ query: askQuery, mode: 'chat' })
         });
         const result = await res.json();
         aiResponse = result.message || "Here are some tools";
         mode = 'search'; // Switch back to see result
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
      <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">Toolz</h1>
      <p class="text-gray-500 mt-2">Discover the best tools for digital creators.</p>
    </div>
    
    <div class="bg-gray-100 p-1 rounded-lg flex items-center">
      <button 
        class="px-4 py-2 rounded-md font-medium text-sm transition-all {mode === 'search' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}"
        onclick={() => mode = 'search'}
      >
        <Search class="w-4 h-4 inline-block mr-2" />
        Search
      </button>
      <button 
        class="px-4 py-2 rounded-md font-medium text-sm transition-all {mode === 'ask' ? 'bg-white shadow-sm text-violet-600' : 'text-gray-500 hover:text-black'}"
        onclick={() => mode = 'ask'}
      >
        <Sparkles class="w-4 h-4 inline-block mr-2" />
        Ask AI
      </button>
    </div>
  </div>

  {#if mode === 'search'}
    <!-- Search UI -->
    <div class="mb-8 space-y-4">
      <div class="relative max-w-xl">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <!-- On enter/input we could trigger form submit to reload page with ?q=... -->
        <!-- For now binding value, but actual search needs form submission or goto -->
        <form action="/toolz">
            <Input type="text" name="q" placeholder="Search tools (e.g. 'design', 'productivity')..." class="pl-10 h-12 text-lg" bind:value={searchQuery} />
        </form>
      </div>
      
      <div class="flex flex-wrap gap-2 items-center text-sm">
        <Filter class="w-4 h-4 text-gray-500 mr-2" />
        <!-- Filters could be links to ?category=All etc -->
        <a href="/toolz?category=All"><Button variant="outline" size="sm" class="rounded-full">All</Button></a>
        <a href="/toolz?category=Design"><Button variant="ghost" size="sm" class="rounded-full">Design</Button></a>
        <a href="/toolz?category=Productivity"><Button variant="ghost" size="sm" class="rounded-full">Productivity</Button></a>
        <a href="/toolz?category=No-code"><Button variant="ghost" size="sm" class="rounded-full">No-code</Button></a>
        <a href="/toolz?category=AI"><Button variant="ghost" size="sm" class="rounded-full">AI</Button></a>
      </div>

      {#if aiResponse}
        <div class="bg-violet-50 border border-violet-100 p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <Sparkles class="w-5 h-5 text-violet-600 flex-shrink-0 mt-1" />
          <p class="text-violet-900">{aiResponse}</p>
        </div>
      {/if}
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each tools as tool}
        <div class="group border rounded-xl overflow-hidden bg-white hover:border-violet-500 transition-all hover:shadow-lg">
          <div class="h-40 bg-gray-100 relative overflow-hidden">
            <!-- Use imageUrl from DB -->
            <img src={tool.imageUrl} alt={tool.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="bg-white/90 p-2 rounded-full shadow-sm hover:bg-white hover:text-red-500 transition-colors">
                <Heart class="w-4 h-4" />
              </button>
            </div>
            <div class="absolute bottom-3 left-3">
              <Badge variant="secondary" class="bg-white/90 backdrop-blur-sm shadow-sm">{tool.pricing}</Badge>
            </div>
          </div>
          <div class="p-5">
            <div class="flex items-center justify-between mb-2">
               <!-- Tags is array? display first one as category -->
              <Badge variant="outline" class="text-xs uppercase tracking-wider text-gray-500">{tool.tags ? tool.tags[0] : 'Tool'}</Badge>
              <a href={tool.url} target="_blank" class="text-gray-400 hover:text-black">
                <ExternalLink class="w-4 h-4" />
              </a>
            </div>
            <h3 class="text-lg font-bold mb-1">{tool.name}</h3>
            <p class="text-sm text-gray-600 line-clamp-2">{tool.shortDescription}</p>
          </div>
        </div>
      {/each}
      
      {#if tools.length === 0}
        <div class="col-span-full text-center py-12 text-gray-500">
           No tools found. Try adjusting your search.
        </div>
      {/if}
    </div>

  {:else}
    <!-- Ask AI UI -->
    <div class="max-w-2xl mx-auto py-12 text-center">
      <div class="inline-flex p-4 rounded-full bg-violet-100 mb-6">
        <Sparkles class="w-8 h-8 text-violet-600" />
      </div>
      <h2 class="text-2xl font-bold mb-4">What build are you looking for?</h2>
      <p class="text-gray-500 mb-8">Describe your project, your stack preference, or your problem. AI will recommend the perfect toolkit.</p>
      
      <div class="relative bg-white border border-gray-200 shadow-sm rounded-xl p-2 focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition-all">
        <textarea 
          class="w-full min-h-[120px] p-4 resize-none outline-none text-lg" 
          placeholder="I need a stack for an e-commerce site that handles subscriptions..."
          bind:value={askQuery}
        ></textarea>
        <div class="flex justify-end p-2 border-t border-gray-100">
          <Button onclick={submitAskAI} disabled={isAsking} class="bg-violet-600 hover:bg-violet-700 text-white font-bold">
            {#if isAsking}
              <Loader2 class="w-4 h-4 mr-2 animate-spin" /> Analyzing...
            {:else}
              <Sparkles class="w-4 h-4 mr-2" /> Find Tools
            {/if}
          </Button>
        </div>
      </div>
    </div>
  {/if}
</div>
