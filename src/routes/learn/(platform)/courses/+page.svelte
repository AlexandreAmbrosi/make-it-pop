<script lang="ts">
  import { Search, Clock, BarChart } from 'lucide-svelte';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import CoursePopup from '$lib/components/CoursePopup.svelte';

  let { data } = $props();
  let courses = $derived(data.courses || []);
  
  let selectedCourse = $state(null);
</script>

<div class="space-y-8">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h1 class="text-3xl font-bold">Finest courses</h1>
      <p class="text-gray-500 mt-2">Level up your skills with our expert-led pathways.</p>
    </div>
    
    <div class="relative w-full md:w-72">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input placeholder="Search courses..." class="pl-9 bg-white" />
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {#if courses.length === 0}
        <div class="col-span-full text-center py-12 text-gray-500">
          <p>No courses found currently. Check back later!</p>
        </div>
    {/if}
    {#each courses as course}
      <!-- Card click opens popup -->
      <button 
        class="text-left w-full group flex flex-col md:flex-row bg-white border rounded-xl overflow-hidden hover:shadow-lg hover:border-orange-300 transition-all"
        onclick={() => selectedCourse = course}
      >
        <div class="w-full md:w-48 h-48 bg-gray-200 flex-shrink-0">
          <img src={course.thumbnailUrl || course.image} alt={course.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div class="p-6 flex flex-col justify-between flex-1">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <Badge variant="secondary" class="bg-orange-100 text-orange-700 hover:bg-orange-200">{course.domain || 'Design'}</Badge>
            </div>
            <h3 class="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors">{course.title}</h3>
            <p class="text-sm text-gray-600 line-clamp-2">{course.description}</p>
          </div>
          
          <div class="flex items-center gap-4 mt-4 text-xs text-gray-500 font-medium">
            <div class="flex items-center">
              <BarChart class="w-3 h-3 mr-1" /> {course.level || 'Beginner'}
            </div>
            <div class="flex items-center">
              <Clock class="w-3 h-3 mr-1" /> {course.duration || '4h'}
            </div>
          </div>
        </div>
      </button>
    {/each}
  </div>

  <CoursePopup 
     isOpen={!!selectedCourse} 
     course={selectedCourse} 
     onClose={() => selectedCourse = null} 
  />
</div>
