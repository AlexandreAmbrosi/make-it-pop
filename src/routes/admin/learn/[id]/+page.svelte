<script lang="ts">
  import { ChevronLeft, Save, FileText, Layers } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { enhance } from '$app/forms';

  let { data } = $props();
  let course = $derived(data.course || {});

  // Simple auto-slug
  function slugify(text: string) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  let title = $state(course.title || '');
  let slug = $state(course.slug || '');

  $effect(() => {
      if (!course.id && title) {
          slug = slugify(title);
      }
  });

</script>

<div class="max-w-4xl mx-auto">
  <div class="flex items-center justify-between mb-8">
    <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" href="/admin/learn">
        <ChevronLeft class="w-4 h-4" />
        </Button>
        <h1 class="text-2xl font-bold">{data.course ? 'Edit Course' : 'New Course'}</h1>
    </div>
    
    {#if data.course}
        <Button variant="outline" href={`/admin/learn/${course.id}/chapters`}>
            <Layers class="w-4 h-4 mr-2" /> Manage Content (Chapters)
        </Button>
    {/if}
  </div>

  <form method="POST" action="?/save" use:enhance class="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-8">
    
    <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="text-sm font-medium">Course Title</label>
                <Input name="title" bind:value={title} placeholder="e.g. UI Design Fundamentals" required />
            </div>
            
            <div class="space-y-2">
                <label class="text-sm font-medium">Slug (URL)</label>
                <Input name="slug" bind:value={slug} placeholder="ui-design-fundamentals" required />
            </div>
        </div>

        <div class="space-y-2">
            <label class="text-sm font-medium">Description</label>
            <Textarea name="description" value={course.description} placeholder="What will students learn?" rows={4} />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
                <label class="text-sm font-medium">Domain / Category</label>
                <select name="domain" class="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm" value={course.domain || 'Design'}>
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                </select>
            </div>
            
            <div class="space-y-2">
                <label class="text-sm font-medium">Level</label>
                <select name="level" class="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm" value={course.level || 'Beginner'}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>

            <div class="space-y-2">
                <label class="text-sm font-medium">Duration</label>
                <Input name="duration" value={course.duration} placeholder="e.g. 2h 30m" />
            </div>
        </div>

        <div class="space-y-2">
            <label class="text-sm font-medium">Thumbnail URL</label>
            <div class="flex gap-4">
                <div class="flex-1">
                    <Input name="thumbnailUrl" value={course.thumbnailUrl} placeholder="https://..." />
                </div>
                {#if course.thumbnailUrl}
                    <div class="w-16 h-10 rounded overflow-hidden bg-gray-100 border">
                        <img src={course.thumbnailUrl} alt="" class="w-full h-full object-cover" />
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <div class="flex items-center justify-between pt-6 border-t border-gray-50">
       <div class="flex items-center gap-3">
            <input type="checkbox" name="isPublished" id="isPublished" class="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" checked={course.isPublished ?? false} />
            <label for="isPublished" class="text-sm font-medium">Published (Visible to students)</label>
       </div>

       <div class="flex gap-3">
            <Button variant="ghost" href="/admin/learn">Cancel</Button>
            <Button type="submit" class="bg-violet-600 hover:bg-violet-700 text-white min-w-[120px]">
                <Save class="w-4 h-4 mr-2" /> Save Course
            </Button>
       </div>
    </div>

  </form>
</div>
