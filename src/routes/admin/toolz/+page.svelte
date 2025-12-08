<script lang="ts">
  import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { enhance } from '$app/forms';

  let { data }  = $props();
  let searchTerm = $state('');

  // Client-side simple search filtering
  let filteredTools = $derived(
    searchTerm 
      ? data.tools.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : data.tools
  );
</script>

<div class="flex flex-col gap-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Toolz Management</h1>
      <p class="text-gray-500">Manage your curated software and applications.</p>
    </div>
    <Button class="bg-violet-600 hover:bg-violet-700 text-white" href="/admin/toolz/new">
      <Plus class="w-4 h-4 mr-2" /> Add New Tool
    </Button>
  </div>

  <div class="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <Search class="w-5 h-5 text-gray-400" />
      <input 
        type="text" 
        placeholder="Search tools..." 
        class="flex-1 outline-none bg-transparent"
        bind:value={searchTerm}
      />
  </div>

  <div class="bg-white border rounded-xl overflow-hidden shadow-sm">
    <table class="w-full text-sm text-left">
      <thead class="bg-gray-50 text-gray-500 font-medium">
        <tr>
          <th class="px-6 py-4">Name</th>
          <th class="px-6 py-4">Category</th>
          <th class="px-6 py-4">Status</th>
          <th class="px-6 py-4">Pricing</th>
          <th class="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        {#each filteredTools as tool}
          <tr class="hover:bg-gray-50 transition-colors group">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                    {#if tool.imageUrl}
                        <img src={tool.imageUrl} alt="" class="w-full h-full object-cover" />
                    {:else}
                         <div class="w-full h-full flex items-center justify-center text-gray-300 font-bold">?</div>
                    {/if}
                </div>
                <div>
                   <div class="font-medium text-gray-900">{tool.name}</div>
                   <a href={tool.url} target="_blank" class="text-xs text-gray-400 hover:underline truncate max-w-[150px] block">{tool.url}</a>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              {#if tool.tags && tool.tags.length > 0}
                <Badge variant="outline" class="text-xs">{tool.tags[0]}</Badge>
              {:else}
                <span class="text-gray-400">-</span>
              {/if}
            </td>
            <td class="px-6 py-4">
               <form method="POST" action="?/toggle" use:enhance>
                  <input type="hidden" name="id" value={tool.id} />
                  <input type="hidden" name="isActive" value={tool.isActive.toString()} />
                  <button class="flex items-center gap-2 cursor-pointer focus:outline-none">
                     <div class={`w-2 h-2 rounded-full ${tool.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                     <span class={tool.isActive ? 'text-green-700' : 'text-gray-500'}>{tool.isActive ? 'Active' : 'Draft'}</span>
                  </button>
               </form>
            </td>
            <td class="px-6 py-4 text-gray-600 capitalize">{tool.pricing || 'Unknown'}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Button variant="ghost" size="icon" class="h-8 w-8 text-gray-500 hover:text-blue-600" href={`/admin/toolz/${tool.id}`}>
                    <Pencil class="w-4 h-4" />
                 </Button>
                 <form method="POST" action="?/delete" use:enhance class="inline">
                    <input type="hidden" name="id" value={tool.id} />
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
