<script lang="ts">
  import { Plus, Search, BookOpen, Layers, Sparkles } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';

    import { goto } from '$app/navigation';
    
    let isGenerating = $state(false);

    async function handleGenerate() {
        const topic = prompt("Enter a topic for the course (e.g. 'Advanced React Patterns'):");
        if (!topic) return;

        isGenerating = true;
        try {
            const res = await fetch('/api/ai/generate-course', {
                method: 'POST',
                body: JSON.stringify({ topic }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            
            if (data.error) {
                alert('Generation failed: ' + data.error);
                return;
            }

            // Redirect to new course page with data pre-filled (via URL params or store, simplest here is URL)
            // But URL length limit. Better: Store in sessionStorage or just create it directly via API?
            // "Scaffold a course" implies typically creating it as DRAFT in DB then redirecting to edit.
            
            // Let's CREATE it dynamically then redirect to edit
            // But we are on client. We need to post to server to create.
            // Actually, let's just use the `new` page and pass data via state/store? 
            // Or simpler: The API creates the draft and returns ID.
            
            // Re-thinking: The endpoint /api/ai/generate-course just returns JSON. 
            // We should ideally have an action on the server that does this.
            // But for now, let's just alert the JSON for proof of concept or console log it?
            // "Your mission is to implement those things." -> Needs to work.

            // Strategy: Auto-create course as draft via API, then redirect to edit.
            const createRes = await fetch('/admin/learn?/save&id=new', {
                 // Creating via form action from JS is tricky without FormData.
                 // Let's just use a dedicated API endpoint to create a course if we want full AI flow.
                 // OR: Pass the data to the /admin/learn/new page via query params (limited size)
            });
            
            // Best Quick approach: Local Storage -> Redirect
            sessionStorage.setItem('ai_course_draft', JSON.stringify(data));
            goto('/admin/learn/new?use_ai=true');

        } catch (e) {
            console.error(e);
            alert('Error generating course');
        } finally {
            isGenerating = false;
        }
    }
  </script>


<div class="flex flex-col gap-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Course Management</h1>
      <p class="text-gray-500">Manage curriculum and learning paths.</p>
    </div>
    <div class="flex gap-3">
        <!-- AI Generator Button -->
        <Button variant="outline" class="text-violet-600 border-violet-200 bg-violet-50 hover:bg-violet-100" onclick={handleGenerate} disabled={isGenerating}>
            {#if isGenerating}
                <Sparkles class="w-4 h-4 mr-2 animate-spin" /> Generating...
            {:else}
                <Sparkles class="w-4 h-4 mr-2" /> Generate Course
            {/if}
        </Button>
        <Button class="bg-violet-600 hover:bg-violet-700 text-white" href="/admin/learn/new">
            <Plus class="w-4 h-4 mr-2" /> New Course
        </Button>
    </div>
  </div>

  <div class="bg-white border rounded-xl overflow-hidden shadow-sm">
    <table class="w-full text-sm text-left">
      <thead class="bg-gray-50 text-gray-500 font-medium">
        <tr>
          <th class="px-6 py-4">Course</th>
          <th class="px-6 py-4">Level</th>
          <th class="px-6 py-4">Status</th>
          <th class="px-6 py-4">Chapters</th>
          <th class="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        {#each data.courses as course}
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={course.thumbnailUrl || course.image} alt="" class="w-full h-full object-cover" />
                </div>
                <div>
                   <div class="font-medium text-gray-900">{course.title}</div>
                   <div class="text-xs text-gray-400 capitalize">{course.domain || 'General'}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 capitalize">
               <Badge variant="secondary">{course.level || 'Beginner'}</Badge>
            </td>
            <td class="px-6 py-4">
               {#if course.isPublished}
                 <Badge class="bg-green-100 text-green-700 hover:bg-green-200">Published</Badge>
               {:else}
                 <Badge variant="outline" class="text-gray-500">Draft</Badge>
               {/if}
            </td>
            <td class="px-6 py-4">
               <Button variant="ghost" size="sm" class="text-violet-600 hover:text-violet-700 p-0 h-auto font-normal" href={`/admin/learn/${course.id}/chapters`}>
                  <Layers class="w-4 h-4 mr-1" /> Manage Chapters
               </Button>
            </td>
            <td class="px-6 py-4 text-right">
              <Button variant="ghost" size="icon" href={`/admin/learn/${course.id}`}>
                 <BookOpen class="w-4 h-4 text-gray-500" />
              </Button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
