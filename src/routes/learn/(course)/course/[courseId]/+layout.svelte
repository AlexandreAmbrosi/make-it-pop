<script lang="ts">
  import { page } from '$app/stores'
  import { ChevronLeft, Menu, X } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button'
  import { scale, fly } from 'svelte/transition'

  let { children, data } = $props()
  // data.structure -> [ { title, slug, chapters: [...] } ]
  // data.course -> { title, level, duration, ... }

  let progress = $state(0)
  let isMobileMenuOpen = $state(false)

  // Scroll progress logic
  function handleScroll(e: Event) {
    const target = e.target as HTMLElement
    const scrollTop = target.scrollTop
    const scrollHeight = target.scrollHeight
    const clientHeight = target.clientHeight

    if (scrollHeight - clientHeight > 0) {
      progress = (scrollTop / (scrollHeight - clientHeight)) * 100
    } else {
      progress = 100
    }
  }

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen
  }
</script>

<div class="flex h-screen overflow-hidden bg-white font-sans text-gray-900">
  <!-- Sidebar (Desktop) -->
  <aside class="hidden w-72 shrink-0 flex-col border-r border-gray-200 bg-gray-50 lg:flex">
    <div class="border-b border-gray-100 p-6">
      <Button variant="ghost" size="sm" href="/learn" class="mb-4 -ml-2 text-gray-500 hover:text-black">
        <ChevronLeft class="mr-1 h-4 w-4" /> Back to Courses
      </Button>
      <h2 class="text-xl leading-tight font-bold tracking-tight">{data.course.title}</h2>
      <div class="mt-2 flex items-center text-xs font-medium text-gray-500">
        <span class="mr-2 rounded-full bg-violet-100 px-2 py-0.5 text-violet-700">{data.course.level || 'Course'}</span>
        <span>{data.course.duration || 'Self-paced'}</span>
      </div>
    </div>

    <div class="flex-1 space-y-8 overflow-y-auto p-4">
      {#each data.structure || [] as part}
        <div>
          {#if part.title}
            <h3 class="mb-3 px-2 text-xs font-bold tracking-widest text-gray-400 uppercase">{part.title}</h3>
          {/if}
          <div class="space-y-0.5">
            {#each part.chapters || [] as chapter}
              {@const isActive = $page.params.chapterSlug === chapter.slug}
              <a
                href="/learn/course/{data.course.slug}/{chapter.slug}"
                class="flex items-center rounded-lg px-3 py-2 text-sm transition-all
                  {isActive ? 'bg-white font-semibold text-violet-700 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}"
              >
                <!-- Simple status indicator -->
                <div class="mr-3 h-1.5 w-1.5 shrink-0 rounded-full {isActive ? 'bg-violet-500' : 'bg-gray-300'}"></div>
                <span class="truncate leading-normal">{chapter.title}</span>
              </a>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <!-- Optional: User Progress in Sidebar Footer -->
    <!-- <div class="p-4 border-t border-gray-200 bg-gray-50"> ... </div> -->
  </aside>

  <!-- Mobile Drawer Overlay -->
  {#if isMobileMenuOpen}
    <div class="fixed inset-0 z-50 flex lg:hidden">
      <!-- Backdrop -->
      <button class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onclick={toggleMobileMenu} aria-label="Close menu"></button>

      <!-- Drawer -->
      <div class="relative flex h-full w-4/5 max-w-xs flex-col bg-white shadow-2xl" transition:fly={{ x: -300, duration: 300 }}>
        <div class="flex items-center justify-between border-b bg-gray-50 p-4">
          <span class="text-lg font-bold">Menu</span>
          <Button variant="ghost" size="icon" onclick={toggleMobileMenu}>
            <X class="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        <div class="flex-1 space-y-6 overflow-y-auto p-4">
          <div class="mb-6">
            <Button variant="ghost" size="sm" href="/learn" class="-ml-2 text-gray-500">
              <ChevronLeft class="mr-1 h-4 w-4" /> Back to Courses
            </Button>
            <h2 class="mt-2 text-lg font-bold">{data.course.title}</h2>
          </div>

          {#each data.structure || [] as part}
            <div>
              {#if part.title}
                <h3 class="mb-3 px-2 text-xs font-bold tracking-widest text-gray-400 uppercase">{part.title}</h3>
              {/if}
              <div class="space-y-0.5">
                {#each part.chapters || [] as chapter}
                  {@const isActive = $page.params.chapterSlug === chapter.slug}
                  <a
                    href="/learn/course/{data.course.slug}/{chapter.slug}"
                    onclick={toggleMobileMenu}
                    class="flex items-center rounded-lg px-3 py-2 text-sm transition-all
                        {isActive ? 'border border-violet-100 bg-violet-50 font-semibold text-violet-700' : 'text-gray-600 hover:bg-gray-50'}"
                  >
                    <span class="truncate">{chapter.title}</span>
                  </a>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- Main Content Area -->
  <main class="relative flex min-w-0 flex-1 flex-col bg-white">
    <!-- Top Bar (Mobile + Progress) -->
    <div class="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <!-- Mobile Header -->
      <div class="flex items-center justify-between p-4 lg:hidden">
        <Button variant="ghost" size="icon" onclick={toggleMobileMenu}>
          <Menu class="h-5 w-5" />
        </Button>
        <span class="max-w-[200px] truncate text-sm font-semibold">{data.course.title}</span>
        <div class="w-9"></div>
        <!-- Spacer -->
      </div>

      <!-- Progress Bar -->
      <div class="h-0.5 w-full bg-transparent">
        <div class="h-full bg-violet-600 transition-all duration-200 ease-out" style="width: {progress}%"></div>
      </div>
    </div>

    <!-- Content Scroll Container -->
    <div class="flex-1 overflow-y-auto scroll-smooth" onscroll={handleScroll}>
      <div class="mx-auto w-full max-w-4xl px-6 py-12 lg:px-12 lg:py-16">
        {@render children()}
      </div>
    </div>
  </main>
</div>
