<script lang="ts">
  import { enhance } from '$app/forms'
  import type { PageData } from './$types'
  import { format } from 'date-fns'

  export let data: PageData
  let creating = false
</script>

<div class="mb-6 flex items-center justify-between">
  <div>
    <h1 class="text-3xl font-bold tracking-tight">Courses</h1>
    <p class="text-muted-foreground">Manage your educational content</p>
  </div>
  <button class="bg-foreground text-background rounded-md px-4 py-2 text-sm font-medium transition-colors hover:opacity-90" on:click={() => (creating = !creating)}>
    {creating ? 'Cancel' : 'New Course'}
  </button>
</div>

{#if creating}
  <div class="bg-card mb-8 max-w-lg rounded-lg border p-6 shadow-sm">
    <h2 class="mb-4 text-lg font-semibold">Create New Course</h2>
    <form method="POST" action="?/create" use:enhance>
      <div class="space-y-4">
        <div>
          <label for="title" class="mb-1 block text-sm font-medium">Course Title</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="e.g. Master SvelteKit"
            class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>
        <div class="flex justify-end gap-2">
          <button type="submit" class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"> Create & Start Building </button>
        </div>
      </div>
    </form>
  </div>
{/if}

<div class="bg-card rounded-md border">
  <div class="relative w-full overflow-auto">
    <table class="w-full caption-bottom text-sm">
      <thead class="[&_tr]:border-b">
        <tr class="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
          <th class="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Title</th>
          <th class="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Slug</th>
          <th class="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Status</th>
          <th class="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Modules/Lessons</th>
          <th class="text-muted-foreground h-12 px-4 text-left text-right align-middle font-medium">Created</th>
        </tr>
      </thead>
      <tbody class="[&_tr:last-child]:border-0">
        {#each data.courses as course}
          <tr class="hover:bg-muted/50 data-[state=selected]:bg-muted group border-b transition-colors">
            <td class="p-4 align-middle font-medium">
              <a href="/admin/courses/{course.id}" class="decoration-primary underline-offset-4 hover:underline">
                {course.title}
              </a>
            </td>
            <td class="text-muted-foreground p-4 align-middle">{course.slug}</td>
            <td class="p-4 align-middle">
              <span
                class="focus:ring-ring inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none {course.isPublished
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'}"
              >
                {course.isPublished ? 'Published' : 'Draft'}
              </span>
            </td>
            <td class="text-muted-foreground p-4 align-middle">
              <!-- TODO: Count chapters/lessons -->
              -
            </td>
            <td class="text-muted-foreground p-4 text-right align-middle">
              {course.createdAt ? format(new Date(course.createdAt), 'MMM d, yyyy') : '-'}
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="5" class="p-8 text-center text-muted-foreground"> No courses found. Create one to get started. </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
