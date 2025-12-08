<script lang="ts">
  import { X, PlayCircle, Star, Users, CheckCircle2 } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';

  export let isOpen = false;
  export let course: any = null;
  export let onClose: () => void;

  // Prevent scrolling when open
  $: if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }
</script>

{#if isOpen && course}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onclick={onClose}></div>

    <!-- Modal Content -->
    <div class="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
      
      <!-- Close Button -->
      <button class="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white md:text-gray-500 transition-colors" onclick={onClose}>
        <X class="w-5 h-5" />
      </button>

      <!-- Left: Visual / Hero -->
      <div class="w-full md:w-2/5 bg-gray-900 relative">
         <img src={course.thumbnailUrl || course.image} alt={course.title} class="w-full h-64 md:h-full object-cover opacity-80" />
         <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
         
         <div class="absolute bottom-6 left-6 right-6 text-white">
            <Badge class="bg-violet-600 hover:bg-violet-700 mb-3 border-none">{course.level || 'All Levels'}</Badge>
            <h2 class="text-2xl md:text-3xl font-bold leading-tight mb-2">{course.title}</h2>
            <div class="flex items-center gap-2 text-sm text-gray-300">
                <Users class="w-4 h-4" /> 1,234 Students
                <span class="mx-1">•</span>
                <Star class="w-4 h-4 text-yellow-400" /> 4.9
            </div>
         </div>
      </div>

      <!-- Right: Content -->
      <div class="w-full md:w-3/5 p-8 flex flex-col">
        <div class="flex-1 space-y-6">
            <div>
                <h3 class="text-lg font-bold mb-2 text-gray-900">About this course</h3>
                <p class="text-gray-600 leading-relaxed">{course.description || "Master the fundamentals with this comprehensive guide."}</p>
            </div>

            <div>
                <h3 class="text-lg font-bold mb-3 text-gray-900">What you'll learn</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {#if course.skills || course.usps}
                        {#each (course.skills || []) as skill}
                            <div class="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle2 class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {skill}
                            </div>
                        {/each}
                         <!-- Fallbacks if no skills -->
                         {#if !(course.skills?.length)}
                            <div class="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 class="w-4 h-4 text-green-500 mt-0.5" /> Core Principles</div>
                            <div class="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 class="w-4 h-4 text-green-500 mt-0.5" /> Best Practices</div>
                            <div class="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 class="w-4 h-4 text-green-500 mt-0.5" /> Real-world Projects</div>
                            <div class="flex items-start gap-2 text-sm text-gray-600"><CheckCircle2 class="w-4 h-4 text-green-500 mt-0.5" /> Career Growth</div>
                        {/if}
                    {/if}
                </div>
            </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
            <div class="text-sm">
                <p class="text-gray-500">Includes</p>
                <p class="font-medium text-gray-900">{course.duration || '4 hours'} • Certificate</p>
            </div>
            <Button size="lg" class="bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-lg shadow-violet-200" href={`/learn/course/${course.id}/intro`}>
                <PlayCircle class="w-5 h-5 mr-2" /> Start Learning Now
            </Button>
        </div>
      </div>

    </div>
  </div>
{/if}
