<script lang="ts">
  import { Library, Search } from 'lucide-svelte';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  
  let { data } = $props();
  let terms = $derived(data.terms || []);
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
    <div class="flex items-center gap-4">
        <div class="p-3 bg-green-100 rounded-lg">
        <Library class="w-8 h-8 text-green-600" />
        </div>
        <h1 class="text-3xl font-bold">Glossary</h1>
    </div>
    
    <div class="relative w-full md:w-72">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <!-- Basic form search for SSR/No-JS support -->
        <form action="/learn/glossary">
            <Input name="q" placeholder="Search terms..." class="pl-9 bg-white" />
        </form>
    </div>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each terms as term}
        <div class="p-6 border rounded-xl bg-white hover:border-green-400 transition-all shadow-sm">
            <h3 class="text-xl font-bold mb-2 text-green-800">{term.term}</h3>
            <p class="text-gray-600 text-sm mb-3">{term.shortDefinition}</p>
            {#if term.longDefinition}
                <div class="text-xs text-gray-400 mt-2 pt-2 border-t">
                    {term.longDefinition}
                </div>
            {/if}
        </div>
    {:else}
        <div class="col-span-full p-12 border rounded-xl bg-gray-50 text-center">
             <p class="text-xl text-gray-500">No terms found.</p>
        </div>
    {/each}
  </div>
</div>
