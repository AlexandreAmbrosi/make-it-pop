<script lang="ts">
  import { page } from '$app/stores';
  import { ChevronLeft, Circle, CheckCircle, Smartphone, Globe, Code } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { onMount } from 'svelte';

  let { children } = $props();
  let progress = $state(0);

  // Mock chapters structure
  const chapters = [
    {
      title: 'Getting Started',
      items: [
        { title: 'Introduction', slug: 'intro', duration: '5 min' },
        { title: 'Setting up Figma', slug: 'setup', duration: '10 min' }
      ]
    },
    {
      title: 'Core Concepts',
      items: [
        { title: 'Typography', slug: 'typography', duration: '15 min' },
        { title: 'Color Theory', slug: 'color', duration: '20 min' },
        { title: 'Layout Grids', slug: 'grids', duration: '25 min' }
      ]
    }
  ];

  // Scroll progress logic
  function handleScroll(e: Event) {
    const target = e.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    
    if (scrollHeight - clientHeight > 0) {
      progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    } else {
      progress = 100;
    }
  }
</script>

<div class="flex h-screen overflow-hidden bg-white">
  <!-- Sidebar -->
  <aside class="w-72 bg-gray-50 border-r border-gray-200 hidden lg:flex flex-col">
    <div class="p-4 border-b border-gray-100">
      <Button variant="ghost" size="sm" href="/learn/courses" class="-ml-2 text-gray-500 hover:text-black">
        <ChevronLeft class="w-4 h-4 mr-1" /> Back to Courses
      </Button>
      <h2 class="mt-4 text-lg font-bold">UI Design Fundamentals</h2>
      <div class="mt-1 flex items-center text-xs text-gray-500">
        <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded-full mr-2">Beginner</span>
        <span>4h 30m total</span>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto p-4 space-y-6">
      {#each chapters as section}
        <div>
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{section.title}</h3>
          <div class="space-y-1">
            {#each section.items as item}
              {@const isActive = $page.params.chapterSlug === item.slug}
              <a 
                href="/learn/course/1/{item.slug}" 
                class="flex items-center px-2 py-1.5 text-sm rounded-md transition-colors {isActive ? 'bg-white shadow-sm text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}"
              >
                {#if isActive}
                  <div class="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></div>
                {:else}
                  <div class="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2"></div>
                {/if}
                <span class="flex-1 truncate">{item.title}</span>
                <span class="text-xs text-gray-400">{item.duration}</span>
              </a>
            {/each}
          </div>
        </div>
      {/each}
    </div>
    
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <div class="flex flex-col gap-2">
         <p class="text-xs text-center text-gray-400">Course progress: 12%</p>
         <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
           <div class="h-full bg-orange-500 w-[12%]"></div>
         </div>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 flex flex-col relative min-w-0" onscroll={handleScroll}>
    <!-- Top Progress Bar -->
    <div class="h-1 w-full bg-gray-100 z-50 shrink-0">
      <div class="h-full bg-orange-500 transition-all duration-100" style="width: {progress}%"></div>
    </div>

    <!-- Mobile Header -->
    <div class="lg:hidden p-4 border-b flex items-center justify-between bg-white sticky top-0 z-40">
       <Button variant="ghost" size="sm" href="/learn/courses">
        <ChevronLeft class="w-4 h-4" />
      </Button>
      <span class="font-bold truncate">UI Design Fundamentals</span>
      <div class="w-8"></div> <!-- Spacer -->
    </div>

    <!-- Content Scroll Area -->
    <div class="flex-1 overflow-y-auto" onscroll={handleScroll}>
      <div class="max-w-3xl mx-auto px-6 py-12">
        {@render children()}
        
        <!-- Navigation Footer -->
        <div class="mt-16 pt-8 border-t flex justify-between">
          <Button variant="outline">Previous: Introduction</Button>
          <Button>Next: Typography <ChevronLeft class="w-4 h-4 ml-2 rotate-180" /></Button>
        </div>
      </div>
    </div>
  </main>
</div>
