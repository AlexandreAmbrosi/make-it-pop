<script lang="ts">
  import { page } from '$app/stores';
  let { data } = $props();
  // data -> { chapter, course }
</script>

<div class="prose prose-lg max-w-none">
  <h1>{data.chapter?.title}</h1>
  
  {#if data.course?.thumbnailUrl}
     <img src={data.course.thumbnailUrl} alt={data.course.title} class="w-full rounded-xl shadow-lg my-8 max-h-[300px] object-cover" />
  {/if}

  <div class="bg-gray-50 p-6 rounded-xl border mb-8 text-sm text-gray-600">
     <p class="font-bold uppercase tracking-wider text-xs mb-2">Content (Raw)</p>
     <!-- Render simple markdown display using whitespace-pre-wrap -->
     <div class="whitespace-pre-wrap font-sans leading-relaxed">
         {data.chapter?.content}
     </div>
  </div>

  <div class="mt-12 flex justify-between pt-8 border-t">
      <div class="text-gray-400 text-sm">Course: {data.course?.title}</div>
  </div>
</div>
