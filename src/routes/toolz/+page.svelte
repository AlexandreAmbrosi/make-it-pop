<script lang="ts">
  import { Search, Sparkles, Filter, ExternalLink, Heart, Loader2 } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Badge } from '$lib/components/ui/badge'

  let { data } = $props()

  let mode = $state<'search' | 'ask'>('search')
  let searchQuery = $state('')
  let isAsking = $state(false)
  let aiResponse = $state('')

  // Use data.tools for the grid, but allow AI override
  let tools = $state(data.tools || [])
  let relatedTools = $state<any[]>([])

  $effect(() => {
    tools = data.tools || []
  })

  let askQuery = $state('')

  async function submitAskAI() {
    if (!askQuery.trim()) return
    isAsking = true
    try {
      const res = await fetch('/api/ai/toolz/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: askQuery, mode: 'chat' }),
      })
      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to fetch')
      }

      aiResponse = result.message || 'Here are some tools'

      // In frontend, result.tools handles the filtering
      // Even if empty, we MUST update 'tools' to show that nothing was found (or just the message)
      if (result.tools) {
        tools = result.tools
        relatedTools = result.relatedTools || []
      }

      mode = 'search' // Switch back to see result
    } catch (e) {
      console.error(e)
      aiResponse = 'Sorry, I encountered an issue connecting to the AI brain. Please try again.'
      mode = 'search'
    } finally {
      isAsking = false
    }
  }

  function formatType(typeStr: string | null) {
    if (!typeStr) return 'TOOL'
    // Clean up postgres array syntax {"Online Tool"} or JSON ["Online Tool"]
    let cleaned = typeStr.replace(/[{}"[\]]/g, '').trim()
    // If comma separated, take the first one or replace comma
    if (cleaned.includes(',')) {
      cleaned = cleaned.split(',')[0]
    }
    return cleaned || 'TOOL'
  }

  function formatAIResponse(text: string) {
    if (!text) return ''
    // Simple markdown bold parser
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  }
</script>

<div class="container mx-auto max-w-7xl px-4 py-8">
  <!-- Header / Toggle -->
  <div class="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
    <div>
      <h1 class="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-3xl font-bold text-transparent">Toolz</h1>
      <p class="mt-2 text-gray-500">Discover the best tools for digital creators.</p>
    </div>

    <div class="flex items-center rounded-lg bg-gray-100 p-1">
      <button
        class="rounded-md px-4 py-2 text-sm font-medium transition-all {mode === 'search' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}"
        onclick={() => (mode = 'search')}
      >
        <Search class="mr-2 inline-block h-4 w-4" />
        Search
      </button>
      <button
        class="rounded-md px-4 py-2 text-sm font-medium transition-all {mode === 'ask' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500 hover:text-black'}"
        onclick={() => (mode = 'ask')}
      >
        <Sparkles class="mr-2 inline-block h-4 w-4" />
        Ask AI
      </button>
    </div>
  </div>

  {#if mode === 'search'}
    <!-- Search UI -->
    <div class="mb-8 space-y-4">
      <div class="relative max-w-xl">
        <Search class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <!-- On enter/input we could trigger form submit to reload page with ?q=... -->
        <!-- For now binding value, but actual search needs form submission or goto -->
        <form action="/toolz">
          <Input type="text" name="q" placeholder="Search tools (e.g. 'design', 'productivity')..." class="h-12 pl-10 text-lg" bind:value={searchQuery} />
        </form>
      </div>

      <div class="flex flex-wrap items-center gap-2 text-sm">
        <Filter class="mr-2 h-4 w-4 text-gray-500" />
        <!-- Filters could be links to ?category=All etc -->
        <a href="/toolz?category=All"><Button variant="outline" size="sm" class="rounded-full">All</Button></a>
        <a href="/toolz?category=Online Tool"><Button variant="ghost" size="sm" class="rounded-full">Online Tool</Button></a>
        <a href="/toolz?category=App/Software"><Button variant="ghost" size="sm" class="rounded-full">App/Software</Button></a>
        <a href="/toolz?category=Web extension"><Button variant="ghost" size="sm" class="rounded-full">Extension</Button></a>
        <a href="/toolz?category=Plugin"><Button variant="ghost" size="sm" class="rounded-full">Plugin</Button></a>
        <a href="/toolz?category=AI Tool"><Button variant="ghost" size="sm" class="rounded-full">AI</Button></a>
        <a href="/toolz?category=Resources"><Button variant="ghost" size="sm" class="rounded-full">Resources</Button></a>
      </div>

      {#if aiResponse}
        <div class="animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-lg border border-violet-100 bg-violet-50 p-4">
          <Sparkles class="mt-1 h-5 w-5 flex-shrink-0 text-violet-600" />
          <p class="text-violet-900">{@html formatAIResponse(aiResponse)}</p>
        </div>
      {/if}
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each tools as tool}
        <div class="group overflow-hidden rounded-xl border bg-white transition-all hover:border-violet-500 hover:shadow-lg">
          <div class="relative h-40 overflow-hidden bg-gray-100">
            <!-- Use imageUrl from DB -->
            {#if tool.metadata?.imageSource === 'logo'}
              <div class="flex h-full w-full items-center justify-center bg-white p-4">
                <img src={tool.imageUrl} alt={tool.name} class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
              </div>
            {:else}
              <img src={tool.imageUrl} alt={tool.name} class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            {/if}
            <div class="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
              <button class="rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white hover:text-red-500">
                <Heart class="h-4 w-4" />
              </button>
            </div>
            <div class="absolute bottom-3 left-3">
              <Badge variant="secondary" class="bg-white/90 shadow-sm backdrop-blur-sm">{tool.pricing}</Badge>
            </div>
          </div>
          <div class="p-5">
            <div class="mb-2 flex items-center justify-between">
              <!-- Display Category instead of Tag -->
              <Badge variant="outline" class="text-xs tracking-wider text-gray-500 uppercase">
                {formatType(tool.type)}
              </Badge>
              <a href={tool.url} target="_blank" class="text-gray-400 hover:text-black">
                <ExternalLink class="h-4 w-4" />
              </a>
            </div>
            <h3 class="mb-1 text-lg font-bold">{tool.name}</h3>
            <p class="line-clamp-2 text-sm text-gray-600">{tool.shortDescription}</p>
          </div>
        </div>
      {/each}

      {#if tools.length === 0}
        <div class="col-span-full py-12 text-center text-gray-500">No tools found. Try adjusting your search.</div>
      {/if}
    </div>

    {#if relatedTools.length > 0}
      <div class="mt-12 mb-6">
        <h2 class="mb-2 inline-block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">Related & Alternative Tools</h2>
        <p class="text-gray-500">Other options you might find useful.</p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each relatedTools as tool}
          <div class="group overflow-hidden rounded-xl border bg-white transition-all hover:border-violet-500 hover:shadow-lg">
            <div class="relative h-40 overflow-hidden bg-gray-100">
              <!-- Use imageUrl from DB -->
              {#if tool.metadata?.imageSource === 'logo'}
                <div class="flex h-full w-full items-center justify-center bg-white p-4">
                  <img src={tool.imageUrl} alt={tool.name} class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                </div>
              {:else}
                <img src={tool.imageUrl} alt={tool.name} class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {/if}
              <div class="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                <button class="rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white hover:text-red-500">
                  <Heart class="h-4 w-4" />
                </button>
              </div>
              <div class="absolute bottom-3 left-3">
                <Badge variant="secondary" class="bg-white/90 shadow-sm backdrop-blur-sm">{tool.pricing}</Badge>
              </div>
            </div>
            <div class="p-5">
              <div class="mb-2 flex items-center justify-between">
                <!-- Display Category instead of Tag -->
                <Badge variant="outline" class="text-xs tracking-wider text-gray-500 uppercase">
                  {formatType(tool.type)}
                </Badge>
                <a href={tool.url} target="_blank" class="text-gray-400 hover:text-black">
                  <ExternalLink class="h-4 w-4" />
                </a>
              </div>
              <h3 class="mb-1 text-lg font-bold">{tool.name}</h3>
              <p class="line-clamp-2 text-sm text-gray-600">{tool.shortDescription}</p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {:else}
    <!-- Ask AI UI -->
    <div class="mx-auto max-w-2xl py-12 text-center">
      <div class="mb-6 inline-flex rounded-full bg-violet-100 p-4">
        <Sparkles class="h-8 w-8 text-violet-600" />
      </div>
      <h2 class="mb-4 text-2xl font-bold">What build are you looking for?</h2>
      <p class="mb-8 text-gray-500">Describe your project, your stack preference, or your problem. AI will recommend the perfect toolkit.</p>

      <div
        class="relative rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition-all focus-within:border-transparent focus-within:ring-2 focus-within:ring-violet-500"
      >
        <textarea
          class="min-h-[120px] w-full resize-none p-4 text-lg outline-none"
          placeholder="I need a stack for an e-commerce site that handles subscriptions..."
          bind:value={askQuery}
        ></textarea>
        <div class="flex justify-end border-t border-gray-100 p-2">
          <Button onclick={submitAskAI} disabled={isAsking} class="bg-violet-600 font-bold text-white hover:bg-violet-700">
            {#if isAsking}
              <Loader2 class="mr-2 h-4 w-4 animate-spin" /> Analyzing...
            {:else}
              <Sparkles class="mr-2 h-4 w-4" /> Find Tools
            {/if}
          </Button>
        </div>
      </div>
    </div>
  {/if}
</div>
