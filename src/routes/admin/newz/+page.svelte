<script lang="ts">
  import { Plus, Search, Pencil, Trash2, FileText, Sparkles } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { enhance } from '$app/forms';

  let { data }  = $props();
  let searchTerm = $state('');

  let filteredArticles = $derived(
    searchTerm 
      ? data.articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()))
      : data.articles
  );
</script>

<div class="flex flex-col gap-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Newz Management</h1>
      <p class="text-gray-500">Manage blog posts and announcements.</p>
    </div>
    <div class="flex gap-3">
        <Button class="bg-violet-600 hover:bg-violet-700 text-white" href="/admin/newz/new">
            <Plus class="w-4 h-4 mr-2" /> Write Article
        </Button>
    </div>
  </div>

  <div class="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <Search class="w-5 h-5 text-gray-400" />
      <input 
        type="text" 
        placeholder="Search articles..." 
        class="flex-1 outline-none bg-transparent"
        bind:value={searchTerm}
      />
  </div>

  <div class="bg-white border rounded-xl overflow-hidden shadow-sm">
    <table class="w-full text-sm text-left">
      <thead class="bg-gray-50 text-gray-500 font-medium">
        <tr>
          <th class="px-6 py-4">Article</th>
          <th class="px-6 py-4">Status</th>
          <th class="px-6 py-4">Date</th>
          <th class="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        {#each filteredArticles as article}
          <tr class="hover:bg-gray-50 transition-colors group">
            <td class="px-6 py-4">
               <div class="flex gap-4">
                 {#if article.imageUrl}
                    <img src={article.imageUrl} alt="" class="w-16 h-12 object-cover rounded" />
                 {/if}
                 <div>
                    <div class="font-medium text-gray-900">{article.title}</div>
                    <div class="text-xs text-gray-400 truncate max-w-[200px]">{article.slug}</div>
                 </div>
               </div>
            </td>
            <td class="px-6 py-4">
               <form method="POST" action="?/toggle" use:enhance>
                  <input type="hidden" name="id" value={article.id} />
                  <input type="hidden" name="isPublished" value={article.isPublished.toString()} />
                  <button class="flex items-center gap-2 cursor-pointer focus:outline-none">
                     <span class={`px-2 py-1 rounded-full text-xs font-medium ${article.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {article.isPublished ? 'Published' : 'Draft'}
                     </span>
                  </button>
               </form>
            </td>
            <td class="px-6 py-4 text-gray-500">
               {new Date(article.createdAt).toLocaleDateString()}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Button variant="ghost" size="icon" class="h-8 w-8 text-gray-500 hover:text-blue-600" href={`/admin/newz/${article.id}`}>
                    <Pencil class="w-4 h-4" />
                 </Button>
                 <form method="POST" action="?/delete" use:enhance class="inline">
                    <input type="hidden" name="id" value={article.id} />
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
