<script lang="ts">
  import { X, PlayCircle, Star, Users, CheckCircle2 } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button'
  import { Badge } from '$lib/components/ui/badge'

  export let isOpen = false
  export let course: any = null
  export let onClose: () => void

  // Prevent scrolling when open
  $: if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
  }
</script>

{#if isOpen && course}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
    <!-- Backdrop -->
    <button class="absolute inset-0 h-full w-full cursor-default border-none bg-black/60 backdrop-blur-sm transition-opacity" onclick={onClose} aria-label="Close modal"></button>

    <!-- Modal Content -->
    <div class="animate-in zoom-in-95 relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto rounded-2xl bg-white shadow-2xl duration-200 md:flex-row">
      <!-- Close Button -->
      <button class="absolute top-4 right-4 z-10 rounded-full bg-black/10 p-2 text-white transition-colors hover:bg-black/20 md:text-gray-500" onclick={onClose}>
        <X class="h-5 w-5" />
      </button>

      <!-- Left: Visual / Hero -->
      <div class="relative w-full bg-gray-900 md:w-2/5">
        <img src={course.thumbnailUrl || course.image} alt={course.title} class="h-64 w-full object-cover opacity-80 md:h-full" />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

        <div class="absolute right-6 bottom-6 left-6 text-white">
          <Badge class="mb-3 border-none bg-violet-600 hover:bg-violet-700">{course.level || 'All Levels'}</Badge>
          <h2 class="mb-2 text-2xl leading-tight font-bold md:text-3xl">{course.title}</h2>
          <div class="flex items-center gap-2 text-sm text-gray-300">
            <Users class="h-4 w-4" /> 1,234 Students
            <span class="mx-1">•</span>
            <Star class="h-4 w-4 text-yellow-400" /> 4.9
          </div>
        </div>
      </div>

      <!-- Right: Content -->
      <div class="flex w-full flex-col p-8 md:w-3/5">
        <div class="flex-1 space-y-6">
          <div>
            <h3 class="mb-2 text-lg font-bold text-gray-900">About this course</h3>
            <p class="leading-relaxed text-gray-600">{course.description || 'Master the fundamentals with this comprehensive guide.'}</p>
          </div>

          <div>
            <h3 class="mb-3 text-lg font-bold text-gray-900">What you'll learn</h3>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {#if course.skills || course.usps}
                {#each course.skills || [] as skill}
                  <div class="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 class="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    {skill}
                  </div>
                {/each}
                <!-- Fallbacks if no skills -->
                {#if !course.skills?.length}
                  <div class="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 class="mt-0.5 h-4 w-4 text-green-500" /> Core Principles</div>
                  <div class="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 class="mt-0.5 h-4 w-4 text-green-500" /> Best Practices</div>
                  <div class="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 class="mt-0.5 h-4 w-4 text-green-500" /> Real-world Projects</div>
                  <div class="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 class="mt-0.5 h-4 w-4 text-green-500" /> Career Growth</div>
                {/if}
              {/if}
            </div>
          </div>
        </div>

        <div class="mt-8 flex items-center justify-between gap-4 border-t border-gray-100 pt-6">
          <div class="text-sm">
            <p class="text-gray-500">Includes</p>
            <p class="font-medium text-gray-900">{course.duration || '4 hours'} • Certificate</p>
          </div>
          <Button
            size="lg"
            class="rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200 hover:bg-violet-700"
            href={`/learn/course/${course.slug || course.id}/intro-to-design`}
          >
            <PlayCircle class="mr-2 h-5 w-5" /> Start Learning Now
          </Button>
        </div>
      </div>
    </div>
  </div>
{/if}
