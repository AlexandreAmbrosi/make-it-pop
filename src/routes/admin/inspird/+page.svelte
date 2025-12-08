<script lang="ts">
  import { Plus, Search, Pencil, Trash2 } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { enhance } from '$app/forms';

  let { data }  = $props();
  let searchTerm = $state('');

  let filteredInspo = $derived(
    searchTerm 
      ? data.inspirations.filter(i => (i.creatorName || '').toLowerCase().includes(searchTerm.toLowerCase()))
      : data.inspirations
  );
</script>

<div class="flex flex-col gap-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Inspiration Management</h1>
      <p class="text-gray-500">Curate the finest design references.</p>
    </div>
    <Button class="bg-violet-600 hover:bg-violet-700 text-white" href="/admin/inspird/new">
      <Plus class="w-4 h-4 mr-2" /> Add Inspiration
    </Button>
  </div>

  <div class="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <Search class="w-5 h-5 text-gray-400" />
      <input 
        type="text" 
        placeholder="Search creator name..." 
        class="flex-1 outline-none bg-transparent"
        bind:value={searchTerm}
      />
  </div>

  <div class="bg-white border rounded-xl overflow-hidden shadow-sm">
    <table class="w-full text-sm text-left">
      <thead class="bg-gray-50 text-gray-500 font-medium">
        <tr>
          <th class="px-6 py-4">Preview</th>
          <th class="px-6 py-4">Creator / Source</th>
          <th class="px-6 py-4">Status</th>
          <th class="px-6 py-4">Tags</th>
          <th class="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        {#each filteredInspo as item}
          <tr class="hover:bg-gray-50 transition-colors group">
            <td class="px-6 py-4">
              <div class="w-24 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                {#if item.thumbnailUrl}
                    <img src={item.thumbnailUrl} alt="" class="w-full h-full object-cover" />
                {:else}
                    <div class="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                {/if}
              </div>
            </td>
            <td class="px-6 py-4">
               <div class="font-medium text-gray-900">{item.creatorName || 'Unknown'}</div>
               <a href={item.resourceUrl} target="_blank" class="text-xs text-gray-400 hover:underline truncate max-w-[150px] block">{item.resourceUrl}</a>
            </td>
            <td class="px-6 py-4">
               <form method="POST" action="?/toggle" use:enhance>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="isActive" value={item.isActive.toString()} />
                  <button class="flex items-center gap-2 cursor-pointer focus:outline-none">
                     <div class={`w-2 h-2 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                     <span class={item.isActive ? 'text-green-700' : 'text-gray-500'}>{item.isActive ? 'Publish' : 'Draft'}</span>
                  </button>
               </form>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                {#if item.tags}
                    {#each item.tags.slice(0, 2) as tag}
                        <Badge variant="outline" class="text-[10px] px-1.5 py-0">{tag}</Badge>
                    {/each}
                    {#if item.tags.length > 2}
                        <span class="text-xs text-gray-400">+{item.tags.length - 2}</span>
                    {/if}
                {:else}
                    <span class="text-gray-400">-</span>
                {/if}
              </div>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Button variant="ghost" size="icon" class="h-8 w-8 text-gray-500 hover:text-blue-600" href={`/admin/inspird/${item.id}`}>
                    <Pencil class="w-4 h-4" />
                 </Button>
                 <form method="POST" action="?/delete" use:enhance class="inline">
                    <input type="hidden" name="id" value={item.id} />
                    <Button variant="ghost" size="icon" class="h-8 w-8 text-gray-500 hover:text-red-600" type="submit">
                        <Trash2 class="w-4 h-4" />
                    </Button>
                 </form>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
