<script lang="ts">
  import { ChevronLeft, Save, Sparkles, Loader2, ArrowRight } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Textarea } from '$lib/components/ui/textarea'
  import { enhance } from '$app/forms'

  let { data } = $props()
  // Use mutable state for form fields to allow AI updates
  let tool = $state(data.tool ? { ...data.tool } : {})

  let isGenerating = $state(false)
  let magicUrls = $state('')
  let processingStatus = $state('')

  async function generateFromUrl() {
    if (!magicUrls) return
    isGenerating = true
    processingStatus = 'Starting...'

    const urls = magicUrls
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean)

    // Single URL mode: standard autofill behavior
    if (urls.length === 1) {
      try {
        processingStatus = 'Analyzing...'
        const res = await fetch('/api/ai/toolz/ingest', {
          method: 'POST',
          body: JSON.stringify({ url: urls[0] }),
          headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || 'Failed to analyze')
        }

        const { data: aiData } = await res.json()

        // Auto-fill form
        tool.name = aiData.name || tool.name
        tool.shortDescription = aiData.shortDescription || tool.shortDescription
        tool.pricing = String(aiData.pricing || 'freemium').toLowerCase()
        const rawType = aiData.type || 'Online Tool'
        tool.type = Array.isArray(rawType) ? rawType[0] : rawType
        tool.url = urls[0]

        if (aiData.imageUrl) tool.imageUrl = aiData.imageUrl
        if (aiData.tags && Array.isArray(aiData.tags)) {
          tool.tags = aiData.tags
        }
        // Save metadata
        tool.metadata = { imageSource: aiData.imageSource || 'og' }
      } catch (e) {
        console.error('Magic Generation Error', e)
        const msg = e instanceof Error ? e.message : 'Unknown error'
        alert(`Error: ${msg}. Please check the URL and try again.`)
      } finally {
        isGenerating = false
        processingStatus = ''
      }
      return
    }

    // Multiple URL mode: Batch processing
    let successCount = 0
    let errorCount = 0
    let errors: string[] = []

    for (let i = 0; i < urls.length; i++) {
      let currentUrl = urls[i]

      // Auto-fix protocol
      if (!currentUrl.startsWith('http')) {
        currentUrl = 'https://' + currentUrl
      }

      try {
        // Validation attempt
        try {
          const uObj = new URL(currentUrl)
          processingStatus = `Processing ${i + 1}/${urls.length}: ${uObj.hostname}...`
        } catch (e) {
          throw new Error(`Invalid URL format: ${currentUrl}`)
        }

        // 1. Analyze
        const analysisRes = await fetch('/api/ai/toolz/ingest', {
          method: 'POST',
          body: JSON.stringify({ url: currentUrl }),
          headers: { 'Content-Type': 'application/json' },
        })

        if (!analysisRes.ok) {
          const errData = await analysisRes.json().catch(() => ({}))
          throw new Error(errData.error || `Analysis failed (${analysisRes.status})`)
        }
        const { data: aiData } = await analysisRes.json()

        // Helper to safely get string from potentially array type
        const rawType = aiData.type || 'Online Tool'
        const safeType = Array.isArray(rawType) ? rawType[0] : rawType

        // 2. Save
        const newTool = {
          name: aiData.name || 'Untitled Tool',
          url: currentUrl,
          shortDescription: aiData.shortDescription || '',
          pricing: String(aiData.pricing || 'freemium').toLowerCase(),
          type: safeType,
          tags: aiData.tags || [],
          imageUrl: aiData.imageUrl || null,
          isActive: true,
          // Save metadata for display logic
          metadata: { imageSource: aiData.imageSource || 'og' },
        }

        const saveRes = await fetch('/api/tools', {
          method: 'POST',
          body: JSON.stringify(newTool),
          headers: { 'Content-Type': 'application/json' },
        })

        if (!saveRes.ok) throw new Error('Save database failed')

        successCount++

        // Rate limiting: wait 1s between requests to be gentle on APIs
        await new Promise((r) => setTimeout(r, 1000))
      } catch (e: any) {
        console.error(`Failed to process ${currentUrl}:`, e)
        errorCount++
        errors.push(`${urls[i]}: ${e.message || e}`)
      }
    }

    isGenerating = false
    processingStatus = ''

    let message = `Batch complete.\nSuccess: ${successCount}\nFailed: ${errorCount}`
    if (errorCount > 0) {
      message += `\n\nErrors:\n${errors.slice(0, 5).join('\n')}`
      if (errors.length > 5) message += `\n...and ${errors.length - 5} more.`
    }
    alert(message)

    if (successCount > 0) {
      window.location.href = '/admin/toolz'
    }
  }
</script>

<div class="mx-auto max-w-3xl">
  <div class="mb-8 flex items-center gap-4">
    <Button variant="ghost" size="icon" href="/admin/toolz">
      <ChevronLeft class="h-4 w-4" />
    </Button>
    <h1 class="text-2xl font-bold">{data.tool ? 'Edit Tool' : 'New Tool'}</h1>
  </div>

  <form method="POST" action="?/save" use:enhance class="space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
    <!-- Magic Ingestion Section -->
    {#if !data.tool}
      <!-- Only show on creation or if explicitly requested -->
      <div class="flex flex-col gap-3 rounded-lg border border-violet-100 bg-violet-50 p-4">
        <div class="flex items-center gap-2 font-medium text-violet-700">
          <Sparkles class="h-4 w-4" />
          <span>Magic Auto-Fill</span>
        </div>
        <div class="flex items-start gap-2">
          <Textarea placeholder="Paste Product URL(s) - one per line" class="min-h-[42px] bg-white" bind:value={magicUrls} rows={magicUrls.includes('\n') ? 5 : 1} />
          <Button type="button" onclick={generateFromUrl} disabled={isGenerating} class="h-auto bg-violet-600 py-3 text-white hover:bg-violet-700">
            {#if isGenerating}
              <Loader2 class="h-4 w-4 animate-spin" />
            {:else}
              <ArrowRight class="h-4 w-4" />
            {/if}
          </Button>
        </div>
        <div class="flex items-center justify-between text-xs text-violet-600/70">
          <p>Paste one or more URLs (one per line). Single URLs auto-fill this form. Multiple URLs are processed and saved automatically.</p>
          {#if processingStatus}
            <span class="animate-pulse font-bold">{processingStatus}</span>
          {/if}
        </div>
      </div>
    {/if}

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div class="space-y-2">
        <label class="text-sm font-medium">Name</label>
        <Input name="name" bind:value={tool.name} placeholder="e.g. Figma" required />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">Website URL</label>
        <Input name="url" bind:value={tool.url} placeholder="https://..." required />
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Short Description</label>
      <Textarea name="shortDescription" bind:value={tool.shortDescription} placeholder="Brief summary..." rows={3} required />
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div class="space-y-2">
        <label class="text-sm font-medium">Image URL</label>
        <Input name="imageUrl" bind:value={tool.imageUrl} placeholder="https://..." />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">Pricing</label>
        <select
          name="pricing"
          class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          bind:value={tool.pricing}
        >
          <option value="free">Free</option>
          <option value="paid">Paid</option>
          <option value="freemium">Freemium</option>
          <option value="contact">Contact</option>
        </select>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">Category</label>
        <select
          name="type"
          class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          bind:value={tool.type}
        >
          <option value="">Select a category</option>
          <option value="Online Tool">Online Tool</option>
          <option value="Web extension">Web extension</option>
          <option value="App/Software">App/Software</option>
          <option value="Plugin">Plugin</option>
          <option value="Resources">Resources</option>
          <option value="AI Tool">AI Tool</option>
        </select>
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Tags (comma separated)</label>
      <!-- Handling array conversion simply for the input -->
      <Input name="tags" value={tool.tags?.join(', ')} oninput={(e) => (tool.tags = e.currentTarget.value.split(',').map((t) => t.trim()))} placeholder="Design, AI, Prototype" />
    </div>

    <div class="flex items-center gap-3 border-t border-gray-50 pt-4">
      <input type="checkbox" name="isActive" id="isActive" class="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" checked={tool.isActive ?? true} />
      <label for="isActive" class="text-sm font-medium">Active (Visible to public)</label>
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <Button variant="ghost" href="/admin/toolz">Cancel</Button>
      <Button type="submit" class="min-w-[120px] bg-violet-600 text-white hover:bg-violet-700">
        <Save class="mr-2 h-4 w-4" /> Save Tool
      </Button>
    </div>
  </form>
</div>
