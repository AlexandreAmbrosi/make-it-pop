<script lang="ts">
  import { goto } from '$app/navigation'
  import { toast } from 'svelte-sonner'
  import { Loader2, Sparkles, FileText, Check, ArrowRight } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button' // Assuming this exists based on usage in other files

  let step = 1
  let loading = false

  // Step 1 Inputs
  let workingTitle = ''
  let primaryKeyword = ''
  let audience = 'Founders & Makers'
  let tone = 'Expert & Actionable'
  let resources = ''

  // Step 2 Data (from AI)
  let draftId = ''
  let aiData: any = null
  let chosenTitle = ''
  let recommendedSlug = ''

  async function generateOutline() {
    if (!primaryKeyword || !resources) {
      toast.error('Please fill in keyword and resources')
      return
    }

    loading = true
    try {
      const res = await fetch('/api/ai/newz/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workingTitle,
          primaryKeyword,
          audience,
          tone,
          resources,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        draftId = data.draftId
        aiData = data.data
        chosenTitle = aiData.titleOptions?.[0] || workingTitle
        recommendedSlug = aiData.recommendedSlug || ''
        step = 2
        toast.success('Outline generated!')
      } else {
        const errorMsg = String(data.error || 'Failed to generate outline').slice(0, 100)
        toast.error(errorMsg)
      }
    } catch (e) {
      toast.error('Error connecting to server')
      console.error(e)
    } finally {
      loading = false
    }
  }

  async function generateFullDraft() {
    if (!draftId) return

    loading = true
    try {
      const res = await fetch('/api/ai/newz/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftId,
          chosenTitle,
          chosenSlug: recommendedSlug,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Article draft created!')
        // Redirect to the editor (assuming /admin/newz/[id] is the editor path)
        goto(`/admin/newz/${data.articleId}`)
      } else {
        toast.error(data.error || 'Failed to create article')
      }
    } catch (e) {
      toast.error('Error generation article')
      console.error(e)
    } finally {
      loading = false
    }
  }
</script>

<div class="mx-auto max-w-4xl px-4 py-10">
  <div class="mb-8">
    <h1 class="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900">
      <Sparkles class="text-violet-600" /> AI Article Writer
    </h1>
    <p class="mt-2 text-gray-500">Generate high-quality, SEO-optimized blog posts from your notes and links.</p>
  </div>

  {#if step === 1}
    <div class="animate-in fade-in slide-in-from-bottom-4 space-y-6 rounded-xl border bg-white p-6 shadow-sm">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="space-y-2">
          <label for="keyword" class="text-sm font-medium text-gray-700">Primary Keyword <span class="text-red-500">*</span></label>
          <input
            id="keyword"
            type="text"
            bind:value={primaryKeyword}
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
            placeholder="e.g. AI tools for developers"
          />
        </div>

        <div class="space-y-2">
          <label for="title" class="text-sm font-medium text-gray-700">Working Title (Optional)</label>
          <input
            id="title"
            type="text"
            bind:value={workingTitle}
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
            placeholder="e.g. Top 10 AI Tools in 2024"
          />
        </div>

        <div class="space-y-2">
          <label for="audience" class="text-sm font-medium text-gray-700">Target Audience</label>
          <select id="audience" bind:value={audience} class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none">
            <option>Founders & Makers</option>
            <option>Developers & Engineers</option>
            <option>Designers & Creatives</option>
            <option>Agencies & Freelancers</option>
            <option>General Tech Enthusiasts</option>
          </select>
        </div>

        <div class="space-y-2">
          <label for="tone" class="text-sm font-medium text-gray-700">Tone of Voice</label>
          <select id="tone" bind:value={tone} class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none">
            <option>Expert & Actionable</option>
            <option>Friendly & Approachable</option>
            <option>Professional & Corporate</option>
            <option>Playful & Witty</option>
            <option>Concise & Direct</option>
          </select>
        </div>
      </div>

      <div class="space-y-2">
        <label for="resources" class="text-sm font-medium text-gray-700">Resources (Links & Notes) <span class="text-red-500">*</span></label>
        <textarea
          id="resources"
          bind:value={resources}
          rows="8"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
          placeholder="Paste URLs to articles, product pages, or your own loose notes here..."
        ></textarea>
        <p class="text-xs text-gray-500">The AI will scrape any URLs found and combine them with your notes for context.</p>
      </div>

      <div class="flex justify-end pt-4">
        <Button class="w-full bg-violet-600 text-white hover:bg-violet-700 md:w-auto" onclick={generateOutline} disabled={loading}>
          {#if loading}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" /> Analyzing Resources...
          {:else}
            <Sparkles class="mr-2 h-4 w-4" /> Generate Outline
          {/if}
        </Button>
      </div>
    </div>
  {/if}

  {#if step === 2 && aiData}
    <div class="animate-in fade-in slide-in-from-right-8 space-y-8">
      <!-- Title Selection -->
      <div class="rounded-xl border bg-white p-6 shadow-sm">
        <h2 class="mb-4 flex items-center gap-2 text-lg font-semibold"><Check class="h-5 w-5 text-green-500" /> Choose a Title</h2>
        <div class="space-y-3">
          {#each aiData.titleOptions as title}
            <label
              class="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50 {chosenTitle === title
                ? 'border-violet-500 bg-violet-50'
                : 'border-gray-200'}"
            >
              <input type="radio" name="title" value={title} bind:group={chosenTitle} class="mt-1 text-violet-600 focus:ring-violet-500" />
              <span class="text-sm font-medium text-gray-900">{title}</span>
            </label>
          {/each}
          <div class="mt-4">
            <label for="slug" class="text-sm font-medium text-gray-700">Slug</label>
            <input id="slug" type="text" bind:value={recommendedSlug} class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      <!-- Outline Preview -->
      <div class="rounded-xl border bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-lg font-semibold">Proposed Outline</h2>
        <div class="prose prose-sm max-w-none text-gray-600">
          <p class="text-gray-500 italic">{aiData.metaDescription}</p>
          <hr class="my-4" />
          <ul class="list-none space-y-4 pl-0">
            {#each aiData.outline as section}
              <li>
                <strong class="block text-base text-gray-900">{section.heading}</strong>
                {#if section.points && section.points.length > 0}
                  <ul class="mt-1 list-disc space-y-1 pl-5">
                    {#each section.points as point}
                      <li>{point}</li>
                    {/each}
                  </ul>
                {/if}
                {#if section.subsections}
                  <div class="mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
                    {#each section.subsections as sub}
                      <div>
                        <span class="font-medium text-gray-800">{sub.heading}</span>
                      </div>
                    {/each}
                  </div>
                {/if}
              </li>
            {/each}
          </ul>

          {#if aiData.faq}
            <div class="mt-6">
              <strong class="mb-2 block text-gray-900">FAQ</strong>
              <ul class="space-y-2">
                {#each aiData.faq as faq}
                  <li class="rounded-lg bg-gray-50 p-3 text-xs">
                    <span class="block font-semibold">{faq.question}</span>
                    <span class="text-gray-500">{faq.answer}</span>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      </div>

      <div class="flex items-center justify-between pt-4">
        <button class="text-sm font-medium text-gray-500 hover:text-gray-700" onclick={() => (step = 1)}> &larr; Back to Resources </button>
        <Button class="bg-violet-600 text-white hover:bg-violet-700" onclick={generateFullDraft} disabled={loading}>
          {#if loading}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" /> Writing Article...
          {:else}
            <FileText class="mr-2 h-4 w-4" /> Generate Full Draft
          {/if}
        </Button>
      </div>
    </div>
  {/if}
</div>
