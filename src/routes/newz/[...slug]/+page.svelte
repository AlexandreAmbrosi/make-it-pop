<script lang="ts">
  import { getDate } from '@/lib/utils/date';
  import { Button } from '$lib/components/ui/button';
  import { ArrowLeft } from 'lucide-svelte';
  import Seo from '@/components/SEO.svelte';

  let { data } = $props();
  // Safe access with fallbacks
  let article = $derived(data.article || {});
  let contentHtml = $derived(data.contentHtml || '');
</script>

<Seo 
  title={article.title || 'Newz'} 
  description={article.description || ''} 
  image={article.imageUrl}
/>

<div class="relative mx-auto flex max-w-4xl flex-col px-8 py-12">
    <Button variant="ghost" href="/newz" class="self-start mb-8 text-gray-500 hover:text-black pl-0">
        <ArrowLeft class="w-4 h-4 mr-2" /> Back to Newz
    </Button>

    {#if article.imageUrl}
        <div class="w-full h-[400px] mb-8 rounded-2xl overflow-hidden shadow-sm bg-gray-100">
            <img src={article.imageUrl} alt={article.title} class="w-full h-full object-cover" />
        </div>
    {/if}

    <div class="flex flex-col gap-4 mb-8">
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">{article.title}</h1>
        
        <div class="flex items-center gap-4 text-gray-500 text-sm">
             {#if article.author}
                <span class="font-medium text-gray-900">{article.author}</span>
                <span>•</span>
             {/if}
             {#if article.createdAt}
                <span>{getDate(article.createdAt)}</span>
             {/if}
        </div>
    </div>
    
    <div class="prose prose-lg prose-slate max-w-none">
        {@html contentHtml}
    </div>
</div>
